// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

/*
============================================================
 ADMIN PANEL ROUTES
 - Check expired organs
 - Approve hospitals
 - View system logs
 - View system statistics
 - Get pending hospitals
============================================================
*/

/* ---------------------------------------------------------
   1. CHECK FOR EXPIRED ORGANS
   Marks organs EXPIRED if expiry_time < NOW()
--------------------------------------------------------- */
router.post(
  "/check-expiry",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      // Find expired but not yet marked expired
      const [expired] = await db.query(
        `SELECT id 
         FROM Organs 
         WHERE expiry_time < NOW() 
         AND status = 'AVAILABLE'`
      );

      if (expired.length === 0)
        return res.json({ message: "No expired organs found." });

      // Update status
      const [updateRes] = await db.query(
        `UPDATE Organs 
         SET status = 'EXPIRED' 
         WHERE expiry_time < NOW() 
         AND status = 'AVAILABLE'`
      );

      // Log
      await db.query(
        `INSERT INTO Logs (user_id, action, entity_type, message)
         VALUES (?, 'EXPIRE_CHECK', 'Organs', ?)`,
        [req.user.id, `Expired ${expired.length} organs`]
      );

      return res.json({
        message: "Expired organs updated",
        expired_count: expired.length,
        expired_organs: expired.map((o) => o.id)
      });
    } catch (err) {
      console.error("CHECK EXPIRY ERROR:", err);
      return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
  }
);

/* ---------------------------------------------------------
   2. GET PENDING HOSPITAL APPROVAL REQUESTS
--------------------------------------------------------- */
router.get(
  "/hospitals/pending",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT * FROM Hospitals WHERE approved = FALSE ORDER BY created_at DESC`
      );

      return res.json(rows);
    } catch (err) {
      console.error("FETCH PENDING HOSPITALS ERROR:", err);
      return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
  }
);
// ADMIN DASHBOARD SUMMARY
router.get(
  "/summary",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const [[donors]] = await db.query("SELECT COUNT(*) AS totalDonors FROM Donors");
      const [[recipients]] = await db.query("SELECT COUNT(*) AS totalRecipients FROM Recipients");
      const [[organs]] = await db.query("SELECT COUNT(*) AS totalOrgans FROM Organs");
      const [[matches]] = await db.query("SELECT COUNT(*) AS totalMatches FROM Matches");

      return res.json({
        totalDonors: donors?.totalDonors || 0,
        totalRecipients: recipients?.totalRecipients || 0,
        totalOrgans: organs?.totalOrgans || 0,
        totalMatches: matches?.totalMatches || 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching summary" });
    }
  }
);

/* ---------------------------------------------------------
   3. APPROVE A HOSPITAL
--------------------------------------------------------- */
router.post(
  "/approve-hospital",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { hospital_id } = req.body;

      if (!hospital_id)
        return res.status(400).json({ error: "hospital_id is required" });

      const [[hospital]] = await db.query(
        "SELECT * FROM Hospitals WHERE id = ?",
        [hospital_id]
      );

      if (!hospital)
        return res.status(404).json({ error: "Hospital not found" });

      // Approve
      await db.query(
        `UPDATE Hospitals SET approved = TRUE WHERE id = ?`,
        [hospital_id]
      );

      // Log
      await db.query(
        `INSERT INTO Logs (user_id, action, entity_type, entity_id, message)
         VALUES (?, 'HOSPITAL_APPROVED', 'Hospital', ?, ?)`,
        [
          req.user.id,
          hospital_id,
          `Admin ${req.user.id} approved hospital ${hospital_id}`
        ]
      );

      return res.json({
        message: "Hospital approved successfully",
        hospital_id
      });
    } catch (err) {
      console.error("APPROVE HOSPITAL ERROR:", err);
      return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
  }
);

/* ---------------------------------------------------------
   4. VIEW LOGS (Limit = optional)
--------------------------------------------------------- */
router.get(
  "/logs",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const limit = Number(req.query.limit || 200);

      const [logs] = await db.query(
        `SELECT * FROM Logs 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [limit]
      );

      return res.json(logs);
    } catch (err) {
      console.error("FETCH LOGS ERROR:", err);
      return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
  }
);

/* ---------------------------------------------------------
   5. SYSTEM STATISTICS (Admin Dashboard)
--------------------------------------------------------- */
router.get(
  "/stats",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const [[donorCount]] = await db.query("SELECT COUNT(*) AS total FROM Donors");
      const [[patientCount]] = await db.query("SELECT COUNT(*) AS total FROM Recipients");
      const [[organCount]] = await db.query("SELECT COUNT(*) AS total FROM Organs");
      const [[matches]] = await db.query(
        "SELECT COUNT(*) AS total FROM Matches WHERE status='SELECTED'"
      );

      return res.json({
        donors: donorCount.total,
        recipients: patientCount.total,
        organs: organCount.total,
        transplants_matched: matches.total
      });
    } catch (err) {
      console.error("STATS ERROR:", err);
      return res.status(500).json({ error: "Internal server error", detail: err.message });
    }
  }
);

module.exports = router;
