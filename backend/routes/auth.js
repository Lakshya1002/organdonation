/**
 * backend/routes/auth.js
 * - POST /api/auth/register
 * - POST /api/auth/login
 */
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, hospital_id } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const [[existing]] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    const [ins] = await db.query('INSERT INTO Users (name, email, password_hash, role, hospital_id) VALUES (?, ?, ?, ?, ?)', [name || null, email, hash, role || 'RECIPIENT', hospital_id || null]);

    const token = jwt.sign({ id: ins.insertId, email, role: role || 'RECIPIENT' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.status(201).json({ message: 'Registered', token, user: { id: ins.insertId, email, role: role || 'RECIPIENT' } });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, hospital_id: user.hospital_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    return res.json({ message: 'Logged in', token, user: { id: user.id, name: user.name, email: user.email, role: user.role, hospital_id: user.hospital_id } });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

module.exports = router;

// Get current user
const { authenticateToken } = require('../middleware/auth');
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // req.user set by authenticateToken
    return res.json({ user: req.user });
  } catch (err) {
    console.error('GET /me error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
