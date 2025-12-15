import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from "@mui/material";

import { useAuthStore } from "../store/authStore";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  width: 500,
};

export default function Recipients() {
  const { token } = useAuthStore();
  const [recipients, setRecipients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    blood_group: "",
    organ_needed: "",
    severity_level: "",
    pra_score: "",
    hla_code: "",
    hospital_id: "",
  });

  const headers = { Authorization: `Bearer ${token}` };

  // Fetch recipients
  const loadRecipients = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/patients", { headers });
      setRecipients(res.data);
    } catch (err) {
      console.error("LOAD RECIPIENTS ERROR:", err);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Add / Update Recipient
  const handleSubmit = async () => {
    try {
      if (editing) {
        await axios.put(
          `http://localhost:3001/api/patients/${editing}`,
          form,
          { headers }
        );
      } else {
        await axios.post("http://localhost:3001/api/patients", form, { headers });
      }

      setOpen(false);
      setEditing(null);
      setForm({
        name: "",
        age: "",
        blood_group: "",
        organ_needed: "",
        severity_level: "",
        pra_score: "",
        hla_code: "",
        hospital_id: "",
      });
      loadRecipients();
    } catch (err) {
      console.error("SAVE RECIPIENT ERROR:", err);
    }
  };

  // Delete recipient
  const deleteRecipient = async (id) => {
    if (!window.confirm("Delete this recipient?")) return;

    try {
      await axios.delete(`http://localhost:3001/api/patients/${id}`, { headers });
      loadRecipients();
    } catch (err) {
      console.error("DELETE RECIPIENT ERROR:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} fontWeight="bold">
        Recipient Management
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        + Add Recipient
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Age</b></TableCell>
              <TableCell><b>Blood Group</b></TableCell>
              <TableCell><b>Organ Needed</b></TableCell>
              <TableCell><b>Severity</b></TableCell>
              <TableCell><b>PRA Score</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {recipients.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.age}</TableCell>
                <TableCell>{r.blood_group}</TableCell>
                <TableCell>{r.organ_needed}</TableCell>
                <TableCell>{r.severity_level}</TableCell>
                <TableCell>{r.pra_score}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      setEditing(r.id);
                      setForm(r);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  &nbsp;
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => deleteRecipient(r.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {recipients.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No Recipients Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            {editing ? "Edit Recipient" : "Add Recipient"}
          </Typography>

          <TextField fullWidth label="Name" name="name" margin="normal"
            value={form.name} onChange={handleChange} />

          <TextField fullWidth label="Age" name="age" margin="normal"
            value={form.age} onChange={handleChange} />

          <TextField fullWidth label="Blood Group" name="blood_group" margin="normal"
            value={form.blood_group} onChange={handleChange} />

          <TextField select fullWidth label="Organ Needed" name="organ_needed" margin="normal"
            value={form.organ_needed} onChange={handleChange}>
            {["HEART", "LIVER", "KIDNEY", "LUNGS"].map((o) => (
              <MenuItem key={o} value={o}>{o}</MenuItem>
            ))}
          </TextField>

          <TextField select fullWidth label="Severity" name="severity_level" margin="normal"
            value={form.severity_level} onChange={handleChange}>
            {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="PRA Score (0–30)" name="pra_score" margin="normal"
            value={form.pra_score} onChange={handleChange} />

          <TextField fullWidth label="HLA Code (comma separated)" name="hla_code" margin="normal"
            value={form.hla_code} onChange={handleChange} />

          <TextField fullWidth label="Hospital ID" name="hospital_id" margin="normal"
            value={form.hospital_id} onChange={handleChange} />

          <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            {editing ? "Update" : "Create"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
