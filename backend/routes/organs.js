// backend/routes/organs.js
const express = require("express");
const router = express.Router();
const db = require("../db/db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

/*
==============================================================
 ORGANS MODULE
 Fields:
   id, donor_id, hospital_id, organ_type, blood_group,
   condition, retrieval_time, expiry_time, hla_code,
   status (AVAILABLE / ALLOCATED / TRANSPLANTED / EXPIRED)
==============================================================
*/

const VIABILITY_HOURS = {
  HEART: 6,
  LUNGS: 8,
  LIVER: 12,
  KIDNEY: 24
};

// ---------------------- Validators --------------------------
function isValidOrganType(type) {
  if (!type) return false;
  return ["HEART", "LIVER", "KIDNEY", "LUNGS"].includes(type.toUpperCase());
}

function isValidBloodGroup(bg) {
  if (!bg) return false;
  return ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"].includes(
    bg.toUpperCase()
  );
}

// ------------------------------------------------------------
// GET ALL ORGANS 
// ------------------------------------------------------------
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, organ_type } = req.query;

    let sql = `
      SELECT o.*, 
        d.name AS donor_name,
        d.blood_group AS donor_blood_group,
        h.name AS hospital_name
      FROM Organs o
      LEFT JOIN Donors d ON d.id = o.donor_id
      LEFT JOIN Hospitals h ON h.id = o.hospital_id
      WHERE 1=1`;

    const params = [];

    if (status) {
      sql += " AND o.status = ?";
      params.push(status.toUpperCase());
    }
    if (organ_type) {
      sql += " AND o.organ_type = ?";
      params.push(organ_type.toUpperCase());
    }

    sql += " ORDER BY o.created_at DESC";

    const [rows] = await db.query(sql, params);

    return res.json(rows);
  } catch (err) {
    console.error("GET organs error:", err);
    return res
      .status(500)
      .json({ error: "Internal server error", detail: err.message });
  }
});

// ------------------------------------------------------------
// GET ONE ORGAN BY ID
// ------------------------------------------------------------
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const organId = Number(req.params.id);
    if (!organId)
      return res.status(400).json({ error: "Invalid organ id" });

    const [[organ]] = await db.query(
      `SELECT o.*, 
          d.name AS donor_name,
          h.name AS hospital_name
       FROM Organs o
       LEFT JOIN Donors d ON d.id = o.donor_id
       LEFT JOIN Hospitals h ON h.id = o.hospital_id
       WHERE o.id = ?`,
      [organId]
    );

    if (!organ) return res.status(404).json({ error: "Organ not found" });

    return res.json(organ);
  } catch (err) {
    console.error("GET organ by id error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ------------------------------------------------------------
// CREATE ORGAN 
// ------------------------------------------------------------
router.post(
  "/",
  authenticateToken,
  authorizeRoles("HOSPITAL_COORDINATOR", "ADMIN"),
  async (req, res) => {
    try {
      const {
        donor_id,
        hospital_id,
        organ_type,
        blood_group,
        hla_code,
        condition
      } = req.body;

      if (!donor_id)
        return res.status(400).json({ error: "donor_id is required" });
      if (!hospital_id)
        return res.status(400).json({ error: "hospital_id is required" });

      if (!isValidOrganType(organ_type))
        return res.status(400).json({ error: "Invalid organ_type" });

      if (!isValidBloodGroup(blood_group))
        return res.status(400).json({ error: "Invalid blood_group" });

      // Validate donor exists
      const [[donor]] = await db.query(
        "SELECT * FROM Donors WHERE id = ?",
        [donor_id]
      );
      if (!donor)
        return res.status(404).json({ error: "Donor not found" });

      // Validate hospital
      const [[hospital]] = await db.query(
        "SELECT * FROM Hospitals WHERE id = ?",
        [hospital_id]
      );
      if (!hospital)
        return res.status(404).json({ error: "Hospital not found" });

      // Times
      const retrieval_time = new Date();
      const hours = VIABILITY_HOURS[organ_type.toUpperCase()] || 12;
      const expiry_time = new Date(
        retrieval_time.getTime() + hours * 3600 * 1000
      );

      // Create organ
      const [result] = await db.query(
        `INSERT INTO Organs 
         (donor_id, hospital_id, organ_type, blood_group, condition, retrieval_time, expiry_time, hla_code, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'AVAILABLE')`,
        [
          donor_id,
          hospital_id,
          organ_type.toUpperCase(),
          blood_group.toUpperCase(),
          condition || "GOOD",
          retrieval_time,
          expiry_time,
          hla_code || null
        ]
      );

      const organ_id = result.insertId;

      // Log
      await db.query(
        `INSERT INTO Logs (user_id, action, entity_type, entity_id, message)
         VALUES (?, 'ORGAN_CREATED', 'Organ', ?, ?)`,
        [
          req.user.id,
          organ_id,
          `Organ ${organ_type} registered by user ${req.user.id}`
        ]
      );

      return res.status(201).json({
        message: "Organ registered successfully",
        organ_id,
        expiry_time
      });
    } catch (err) {
      console.error("CREATE organ error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", detail: err.message });
    }
  }
);

// ------------------------------------------------------------
// UPDATE ORGAN
// ------------------------------------------------------------
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("HOSPITAL_COORDINATOR", "ADMIN"),
  async (req, res) => {
    try {
      const organId = Number(req.params.id);
      if (!organId)
        return res.status(400).json({ error: "Invalid organ id" });

      const body = req.body || {};
      const updates = [];
      const params = [];

      if (body.condition) {
        updates.push("condition = ?");
        params.push(body.condition.toUpperCase());
      }
      if (body.status) {
        updates.push("status = ?");
        params.push(body.status.toUpperCase());
      }
      if (body.hla_code !== undefined) {
        updates.push("hla_code = ?");
        params.push(body.hla_code);
      }

      if (updates.length === 0)
        return res.status(400).json({ error: "No fields to update" });

      params.push(organId);

      await db.query(`UPDATE Organs SET ${updates.join(", ")} WHERE id = ?`, params);

      // Log
      await db.query(
        `INSERT INTO Logs (user_id, action, entity_type, entity_id, message)
         VALUES (?, 'ORGAN_UPDATED', 'Organ', ?, ?)`,
        [
          req.user.id,
          organId,
          `Organ ${organId} updated by user ${req.user.id}`
        ]
      );

      return res.json({ message: "Organ updated" });
    } catch (err) {
      console.error("UPDATE organ error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", detail: err.message });
    }
  }
);

// ------------------------------------------------------------
// DELETE ORGAN
// ------------------------------------------------------------
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const organId = Number(req.params.id);
      if (!organId)
        return res.status(400).json({ error: "Invalid organ id" });

      await db.query("DELETE FROM Organs WHERE id = ?", [organId]);

      await db.query(
        `INSERT INTO Logs (user_id, action, entity_type, entity_id, message)
         VALUES (?, 'ORGAN_DELETED', 'Organ', ?, ?)`,
        [
          req.user.id,
          organId,
          `Organ ${organId} deleted by admin ${req.user.id}`
        ]
      );

      return res.json({ message: "Organ deleted" });
    } catch (err) {
      console.error("DELETE organ error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
