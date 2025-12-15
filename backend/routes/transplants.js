const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all matches (since schema uses Matches table)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Matches ORDER BY generated_at DESC');
    return res.json(rows);
  } catch (err) {
    console.error('GET Matches error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Create a new match (adapted from previous transplant endpoint)
router.post('/', async (req, res) => {
  try {
    const { organ_id, recipient_id, medical_score, non_medical_score, final_score } = req.body;

    if (!organ_id || !recipient_id) {
      return res.status(400).json({ error: 'organ_id and recipient_id are required' });
    }

    const sql = `INSERT INTO Matches (organ_id, recipient_id, medical_score, non_medical_score, final_score, status) VALUES (?, ?, ?, ?, ?, 'PENDING')`;
    const [result] = await db.query(sql, [organ_id, recipient_id, medical_score || null, non_medical_score || null, final_score || null]);
    return res.json({ message: 'Match added', id: result.insertId });
  } catch (err) {
    console.error('CREATE Match error:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// Get a single match by id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const [[row]] = await db.query('SELECT * FROM Matches WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Match not found' });
    return res.json(row);
  } catch (err) {
    console.error('GET match by id error:', err);
    return res.status(500).json({ error: err.message });
  }
});
