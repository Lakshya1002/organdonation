const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all donors
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM Donors ORDER BY registered_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET donors error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Register a new donor
router.post('/', async (req, res) => {
  const { name, age, gender, blood_group, donor_type, consent, medical_notes, created_by, email, phone } = req.body;

  // Basic validation
  if (!name || !blood_group) {
    return res.status(400).json({ error: 'Name and blood_group are required.' });
  }

  try {
    const sql = `INSERT INTO Donors (name, age, gender, blood_group, donor_type, consent, medical_notes, created_by, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [name, age || null, gender || null, blood_group.toUpperCase(), donor_type || 'LIVE', consent ? 1 : 0, medical_notes || null, created_by || null, email || null, phone || null]);

    res.status(201).json({ message: 'Donor registered successfully', id: result.insertId });
  } catch (err) {
    console.error('CREATE donor error:', err);
    res.status(500).json({ error: 'Database error during registration' });
  }
});

module.exports = router;

// Get donor by id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const [[row]] = await db.query('SELECT * FROM Donors WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Donor not found' });
    return res.json(row);
  } catch (err) {
    console.error('GET donor by id error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const fields = [];
    const params = [];
    const body = req.body || {};
    if (body.name) { fields.push('name = ?'); params.push(body.name); }
    if (body.age !== undefined) { fields.push('age = ?'); params.push(body.age); }
    if (body.gender) { fields.push('gender = ?'); params.push(body.gender); }
    if (body.blood_group) { fields.push('blood_group = ?'); params.push(body.blood_group.toUpperCase()); }
    if (body.donor_type) { fields.push('donor_type = ?'); params.push(body.donor_type); }
    if (body.consent !== undefined) { fields.push('consent = ?'); params.push(body.consent ? 1 : 0); }
    if (body.medical_notes !== undefined) { fields.push('medical_notes = ?'); params.push(body.medical_notes); }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(id);
    await db.query(`UPDATE Donors SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ message: 'Donor updated' });
  } catch (err) {
    console.error('UPDATE donor error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// Delete donor
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await db.query('DELETE FROM Donors WHERE id = ?', [id]);
    return res.json({ message: 'Donor deleted' });
  } catch (err) {
    console.error('DELETE donor error:', err);
    return res.status(500).json({ error: err.message });
  }
});
