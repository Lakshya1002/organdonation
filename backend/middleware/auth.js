// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '8h';

/**
 * authenticateToken
 * - Verifies the bearer token and attaches `req.user = { id, email, role, hospital_id }`
 * - Returns 401 if missing/invalid
 */
function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid Authorization format' });
    }

    const token = parts[1];
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
      // Attach sanitized user object to request
      req.user = {
        id: payload.id,
        email: payload.email,
        role: (payload.role || '').toString().toUpperCase(),
        hospital_id: payload.hospital_id || null
      };
      return next();
    });
  } catch (err) {
    console.error('authenticateToken error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * authorizeRoles(...allowedRoles)
 * - Middleware factory checks req.user.role (requires authenticateToken earlier)
 */
function authorizeRoles(...allowedRoles) {
  const allowed = allowedRoles.map(r => r.toString().toUpperCase());
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
      const role = (req.user.role || '').toString().toUpperCase();
      if (!allowed.includes(role)) {
        return res.status(403).json({ error: 'Forbidden — insufficient role' });
      }
      return next();
    } catch (err) {
      console.error('authorizeRoles error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
