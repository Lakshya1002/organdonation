const express = require('express');
const router = express.Router();
const db = require('../db/db');
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

// Get all recipients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM Recipients ORDER BY pra_score DESC, created_at ASC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET recipients error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create recipient
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const fields = [
      'name',
      'age',
      'gender',
      'blood_group',
      'organ_needed',
      'hospital_id',
      'severity_level',
      'pra_score',
      'hla_code',
      'crossmatch_result',
      'status',
      'waiting_since'
    ];

    const values = fields.map((f) => (body[f] !== undefined ? body[f] : null));
    const placeholders = fields.map(() => '?').join(', ');

    const [result] = await db.query(
      `INSERT INTO Recipients (${fields.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return res.status(201).json({ id: result.insertId, message: 'Recipient created' });
  } catch (err) {
    console.error('CREATE recipient error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   COORDINATOR DASHBOARD SUMMARY
   /api/patients/summary-coordinator
--------------------------------------------------------- */
router.get(
  "/summary-coordinator",
  authenticateToken,
  authorizeRoles("HOSPITAL_COORDINATOR"),
  async (req, res) => {
    try {
      const [[pendingRecipients]] = await db.query(
        "SELECT COUNT(*) AS pending FROM Recipients WHERE status='WAITING'"
      );

      const [[availableOrgans]] = await db.query(
        "SELECT COUNT(*) AS available FROM Organs WHERE status='AVAILABLE'"
      );

      return res.json({
        pendingRecipients,
        availableOrgans,
      });
    } catch (error) {
      console.error("Coordinator Summary Error:", error);
      res.status(500).json({ message: "Coordinator summary error" });
    }
  }
);

module.exports = router;

// Get recipient by id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const [[row]] = await db.query('SELECT * FROM Recipients WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Recipient not found' });
    return res.json(row);
  } catch (err) {
    console.error('GET recipient by id error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update recipient
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const body = req.body || {};
    const fields = [];
    const params = [];
    ['name','age','gender','blood_group','organ_needed','hospital_id','severity_level','pra_score','hla_code','crossmatch_result','status','waiting_since'].forEach(k => {
      if (body[k] !== undefined) { fields.push(`${k} = ?`); params.push(body[k]); }
    });
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(id);
    await db.query(`UPDATE Recipients SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ message: 'Recipient updated' });
  } catch (err) {
    console.error('UPDATE recipient error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete recipient
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await db.query('DELETE FROM Recipients WHERE id = ?', [id]);
    return res.json({ message: 'Recipient deleted' });
  } catch (err) {
    console.error('DELETE recipient error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   DOCTOR DASHBOARD SUMMARY
   /api/patients/summary-doctor
--------------------------------------------------------- */
router.get(
  "/summary-doctor",
  authenticateToken,
  authorizeRoles("DOCTOR"),
  async (req, res) => {
    try {
      const [[alivePatients]] = await db.query(
        "SELECT COUNT(*) AS patients FROM Recipients WHERE status='WAITING'"
      );

      const [[matchesDone]] = await db.query(
        "SELECT COUNT(*) AS total FROM Matches"
      );

      return res.json({
        alivePatients,
        matchesDone: matchesDone.total,
      });
    } catch (error) {
      console.error("Doctor Summary Error:", error);
      res.status(500).json({ message: "Doctor summary error" });
    }
  }
);
