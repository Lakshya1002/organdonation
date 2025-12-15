/**
 * backend/routes/matching.js
 * FIXED: Added Waiting Time logic, standardized Blood Logic, and simplified scoring.
 */
const express = require("express");
const router = express.Router();
const db = require('../db/db');
const { authenticateToken } = require("../middleware/auth");

// SCORING WEIGHTS
const WEIGHTS = { 
  BLOOD: 40,      // Critical: 40 points if compatible
  URGENCY: 30,    // High urgency = more points
  AGE: 20,        // Closer age = more points
  WAITING: 10     // Longer wait = more points
};

/**
 * Run Matching Algorithm
 * POST /api/matches/run
 * Body: { organ_id }
 */
async function runMatchingAlgorithm(req, res) {
  try {
    const { organ_id } = req.body;
    if(!organ_id) return res.status(400).json({ error: "Organ ID required" });

    // 1. Fetch the Organ and its Donor details
    const [[organ]] = await db.query(`
      SELECT o.*, d.blood_group AS donor_blood, d.age AS donor_age 
      FROM Organs o
      JOIN Donors d ON o.donor_id = d.id
      WHERE o.id = ? AND o.status = 'AVAILABLE'`, [organ_id]);

    if (!organ) return res.status(404).json({ error: "Organ not found or not available" });

    // 2. Fetch Waiting Recipients needing this organ type
    const [recipients] = await db.query(
      `SELECT * FROM Recipients WHERE status = 'WAITING' AND organ_needed = ?`, 
      [organ.organ_type]
    );

    let matches = [];

    recipients.forEach(recipient => {
      // --- FILTER: Blood Compatibility ---
      if (!checkBloodCompatibility(organ.donor_blood, recipient.blood_group)) return;

      let score = 0;
      let breakdown = { blood: 0, urgency: 0, age: 0, waiting: 0 };

      // A. Blood Score (Pass = Full Points)
      score += WEIGHTS.BLOOD;
      breakdown.blood = WEIGHTS.BLOOD;

      // B. Urgency Score (Based on PRA Score or Severity)
      // Normalize urgency to 0-1 range then multiply by weight
      let urgencyFactor = 0.5; // default medium
      if (recipient.pra_score !== null) {
          urgencyFactor = Math.min(100, recipient.pra_score) / 100;
      } else if (recipient.severity_level) {
          const s = recipient.severity_level.toUpperCase();
          if (s === 'HIGH') urgencyFactor = 0.9;
          if (s === 'MEDIUM') urgencyFactor = 0.5;
          if (s === 'LOW') urgencyFactor = 0.2;
      }
      const urgencyPoints = urgencyFactor * WEIGHTS.URGENCY;
      score += urgencyPoints;
      breakdown.urgency = Math.round(urgencyPoints);

      // C. Age Proximity Score
      // If age difference is small, higher score
      const donorAge = organ.donor_age || 30;
      const recipientAge = recipient.age || 30;
      const ageDiff = Math.abs(donorAge - recipientAge);
      
      let agePoints = 0;
      if (ageDiff <= 10) agePoints = WEIGHTS.AGE;       // <10 years diff: Full points
      else if (ageDiff <= 20) agePoints = WEIGHTS.AGE * 0.5; // <20 years diff: Half points
      // else 0 points
      
      score += agePoints;
      breakdown.age = agePoints;

      // D. Waiting Time Score
      // 1 point per month waiting, max 10 points
      let waitingPoints = 0;
      if (recipient.waiting_since) {
         const waitDate = new Date(recipient.waiting_since);
         const now = new Date();
         const diffTime = Math.abs(now - waitDate);
         const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)); 
         waitingPoints = Math.min(WEIGHTS.WAITING, diffMonths);
      }
      score += waitingPoints;
      breakdown.waiting = waitingPoints;

      matches.push({
        recipient_id: recipient.id,
        recipient_name: recipient.name,
        blood_group: recipient.blood_group,
        total_score: Math.round(score),
        scores: breakdown
      });
    });

    // Sort by highest score
    matches.sort((a, b) => b.total_score - a.total_score);

    res.json({ organ, matches });

  } catch (err) {
    console.error("Matching Error:", err);
    res.status(500).json({ error: 'Matching algorithm failed' });
  }
}

// Helper: Blood Compatibility
function checkBloodCompatibility(donor, recipient) {
    const d = (donor || '').toUpperCase();
    const r = (recipient || '').toUpperCase();
    
    if (d === 'O-') return true; // Universal Donor
    if (r === 'AB+') return true; // Universal Recipient
    if (d === r) return true; // Exact match

    // Specific compatibilities
    if (d === 'O+' && ['A+', 'B+', 'AB+'].includes(r)) return true;
    if (d === 'A-' && ['A+', 'AB+', 'AB-'].includes(r)) return true;
    if (d === 'A+' && ['AB+'].includes(r)) return true;
    if (d === 'B-' && ['B+', 'AB+', 'AB-'].includes(r)) return true;
    if (d === 'B+' && ['AB+'].includes(r)) return true;
    
    return false; 
}

// Register Routes
router.post('/run', authenticateToken, runMatchingAlgorithm);

// Allocate Route
router.post('/allocate', authenticateToken, async (req, res) => {
    try {
      const { organ_id, recipient_id, final_score } = req.body;
      if (!organ_id || !recipient_id) return res.status(400).json({ error: 'organ_id and recipient_id required' });

      // 1. Create Match Record
      const [ins] = await db.query(
        `INSERT INTO Matches (organ_id, recipient_id, final_score, status, generated_at) VALUES (?, ?, ?, 'SELECTED', NOW())`,
        [organ_id, recipient_id, final_score || 0]
      );

      // 2. Mark Organ as ALLOCATED
      await db.query(`UPDATE Organs SET status = 'ALLOCATED', allocated_to_match_id = ? WHERE id = ?`, [ins.insertId, organ_id]);

      // 3. Mark Recipient as MATCHED
      await db.query(`UPDATE Recipients SET status = 'MATCHED' WHERE id = ?`, [recipient_id]);

      return res.status(201).json({ message: 'Organ allocated successfully', match_id: ins.insertId });
    } catch (err) {
      console.error('ALLOCATE error:', err);
      return res.status(500).json({ error: err.message });
    }
});

module.exports = router;