/**
 * backend/routes/organs.js
 * FIXED: Route definitions to prevent 404s.
 */
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const VIABILITY_HOURS = {
  HEART: 6,
  LUNGS: 8,
  LIVER: 12,
  KIDNEY: 24,
  PANCREAS: 12
};

// GET ALL ORGANS
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, organ_type } = req.query;
    let sql = `SELECT o.*, d.name AS donor_name, d.blood_group AS donor_blood_group, h.name AS hospital_name 
               FROM Organs o
               LEFT JOIN Donors d ON d.id = o.donor_id
               LEFT JOIN Hospitals h ON h.id = o.hospital_id
               WHERE 1=1`;
    
    const params = [];
    if (status) { sql += " AND o.status = ?"; params.push(status.toUpperCase()); }
    if (organ_type) { sql += " AND o.organ_type = ?"; params.push(organ_type.toUpperCase()); }
    
    sql += " ORDER BY o.created_at DESC";
    const [rows] = await db.query(sql, params);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// CREATE ORGAN
router.post("/", authenticateToken, authorizeRoles("HOSPITAL_COORDINATOR", "ADMIN"), async (req, res) => {
  try {
    const { donor_id, hospital_id, organ_type, blood_group, condition } = req.body;
    
    if (!donor_id || !organ_type || !blood_group) return res.status(400).json({ error: "Missing required fields" });

    const retrieval_time = new Date();
    const hours = VIABILITY_HOURS[organ_type.toUpperCase()] || 24;
    const expiry_time = new Date(retrieval_time.getTime() + hours * 3600 * 1000);

    const [result] = await db.query(
      `INSERT INTO Organs (donor_id, hospital_id, organ_type, blood_group, \`condition\`, retrieval_time, expiry_time, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
      [donor_id, hospital_id || null, organ_type.toUpperCase(), blood_group.toUpperCase(), condition || "GOOD", retrieval_time, expiry_time]
    );

    res.status(201).json({ message: "Organ added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE ORGAN (Handles Status Updates)
router.put("/:id", authenticateToken, authorizeRoles("HOSPITAL_COORDINATOR", "ADMIN"), async (req, res) => {
  try {
    const organId = req.params.id;
    const { status, condition } = req.body;
    
    let updates = [];
    let params = [];

    if (status) { updates.push("status = ?"); params.push(status.toUpperCase()); }
    if (condition) { updates.push("\`condition\` = ?"); params.push(condition); }

    if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

    params.push(organId);
    await db.query(`UPDATE Organs SET ${updates.join(", ")} WHERE id = ?`, params);

    res.json({ message: "Organ updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ORGAN
router.delete("/:id", authenticateToken, authorizeRoles("ADMIN"), async (req, res) => {
  try {
    await db.query("DELETE FROM Organs WHERE id = ?", [req.params.id]);
    res.json({ message: "Organ deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;