const express = require("express");
const router = express.Router();
const db = require('../db/db');

async function runMatchingAlgorithm(req, res) {
  try {
    // 1. Fetch available organs (with donor info) and waiting recipients
    const [organs] = await db.query(`
      SELECT o.*, d.name AS donor_name, d.blood_group AS donor_blood_group, d.age AS donor_age
      FROM Organs o
      LEFT JOIN Donors d ON d.id = o.donor_id
      WHERE o.status = 'AVAILABLE'
    `);

    const [recipients] = await db.query(`SELECT * FROM Recipients WHERE status = 'WAITING'`);

    let potentialMatches = [];

    // Algorithm Weights
    const WEIGHTS = { BLOOD: 40, URGENCY: 30, AGE: 20, WAITING_TIME: 10 };

    organs.forEach(org => {
      recipients.forEach(recipient => {
        // Basic hard filter: organ type must match recipient need
        if ((org.organ_type || '').toString().toUpperCase() !== (recipient.organ_needed || '').toString().toUpperCase()) return;

        let score = 0;
        let reasons = [];

        // A. Blood Compatibility Check (donor blood from organ join)
        if (checkBloodCompatibility((org.donor_blood_group || '').toString().toUpperCase(), (recipient.blood_group || '').toString().toUpperCase())) {
          score += WEIGHTS.BLOOD;
          reasons.push('Blood Type Compatible');
        } else {
          return; // incompatible
        }

        // B. Urgency: prefer pra_score if present, otherwise map severity_level
        let urgency = 0;
        if (recipient.pra_score !== null && recipient.pra_score !== undefined) {
          urgency = Math.min(10, Math.round(Number(recipient.pra_score) / 10));
        } else if (recipient.severity_level) {
          const s = (recipient.severity_level || '').toString().toUpperCase();
          if (s === 'HIGH') urgency = 9;
          else if (s === 'MEDIUM') urgency = 6;
          else if (s === 'LOW') urgency = 3;
          else urgency = 5;
        } else {
          urgency = 5;
        }
        score += (urgency / 10) * WEIGHTS.URGENCY;
        if (urgency >= 8) reasons.push('High Urgency Recipient');

        // C. Age proximity between donor (from org.donor_age) and recipient
        const donorAge = Number(org.donor_age || org.age || 0);
        const recAge = Number(recipient.age || 0);
        const ageDiff = Math.abs(donorAge - recAge);
        if (ageDiff <= 10) score += WEIGHTS.AGE;
        else if (ageDiff <= 20) score += WEIGHTS.AGE / 2;

        // Add to list if score is decent
        if (score >= 50) {
          potentialMatches.push({
            organ: org,
            recipient,
            score: Math.round(score),
            reasons
          });
        }
      });
    });

    // Sort matches by score (Highest first)
    potentialMatches.sort((a, b) => b.score - a.score);

    res.json({ count: potentialMatches.length, matches: potentialMatches });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Matching algorithm failed.' });
  }
}

// Helper: Blood Type Compatibility Logic
function checkBloodCompatibility(donor, recipient) {
    if (donor === 'O-') return true; // Universal Donor
    if (recipient === 'AB+') return true; // Universal Recipient
    if (donor === recipient) return true; // Exact match
    
    // Specific cases
    if (donor === 'O+' && (recipient === 'O+' || recipient === 'A+' || recipient === 'B+' || recipient === 'AB+')) return true;
    if (donor === 'A-' && (recipient === 'A-' || recipient === 'A+' || recipient === 'AB-' || recipient === 'AB+')) return true;
    if (donor === 'A+' && (recipient === 'A+' || recipient === 'AB+')) return true;
    // ... add other specific rules as needed
    
    return false; 
}

  // Expose route on the router so `require('./routes/matching')` returns a router
  router.get('/run', runMatchingAlgorithm);

  module.exports = router;

  // Allocate an organ to a recipient (create a Match and mark organ ALLOCATED)
  router.post('/allocate', async (req, res) => {
    try {
      const { organ_id, recipient_id, medical_score, non_medical_score, final_score } = req.body;
      if (!organ_id || !recipient_id) return res.status(400).json({ error: 'organ_id and recipient_id required' });

      // Create match
      const [ins] = await db.query(
        `INSERT INTO Matches (organ_id, recipient_id, medical_score, non_medical_score, final_score, status) VALUES (?, ?, ?, ?, ?, 'SELECTED')`,
        [organ_id, recipient_id, medical_score || null, non_medical_score || null, final_score || null]
      );

      // Mark organ as allocated
      await db.query(`UPDATE Organs SET status = 'ALLOCATED', allocated_to_match_id = ? WHERE id = ?`, [ins.insertId, organ_id]);

      return res.status(201).json({ message: 'Organ allocated', match_id: ins.insertId });
    } catch (err) {
      console.error('ALLOCATE error:', err);
      return res.status(500).json({ error: err.message });
    }
  });