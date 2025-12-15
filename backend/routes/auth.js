/**
 * backend/routes/auth.js
 * FIXED: Removed ability for public users to register as ADMIN.
 */
const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

// REGISTER - Public (Forces role to RECIPIENT)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, hospital_id } = req.body;
    
    // SECURITY FIX: Hardcode role to RECIPIENT. 
    // Admins/Doctors must be created via direct DB access or an Admin-only route.
    const role = 'RECIPIENT'; 

    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Check if user exists
    const [[existing]] = await db.query('SELECT id FROM Users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, 10);
    
    const [ins] = await db.query(
      'INSERT INTO Users (name, email, password_hash, role, hospital_id) VALUES (?, ?, ?, ?, ?)', 
      [name || null, email, hash, role, hospital_id || null]
    );

    const token = jwt.sign({ id: ins.insertId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    
    return res.status(201).json({ 
        message: 'Registration successful', 
        token, 
        user: { id: ins.insertId, email, role } 
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const [[user]] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, hospital_id: user.hospital_id }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES }
    );

    return res.json({ 
        message: 'Logged in', 
        token, 
        user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            hospital_id: user.hospital_id 
        } 
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;