import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, TextField, MenuItem } from "@mui/material";

export default function OrganRegistration() {
  const [formData, setFormData] = useState({
    donor_id: "",
    hospital_id: "",
    organ_type: "",
    blood_group: "",
    hla_code: "",
    condition: "",
  });

  const [donors, setDonors] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load donors on mount
  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/donors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonors(res.data);
    } catch (err) {
      console.error("Failed to load donors:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitOrgan = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/organs",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Organ successfully registered!");

      // Reset form
      setFormData({
        donor_id: "",
        hospital_id: "",
        organ_type: "",
        blood_group: "",
        hla_code: "",
        condition: "",
      });

    } catch (err) {
      console.error("ORGAN REGISTER ERROR:", err);
      setError("Failed to register organ");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Register Organ</h1>

      {success && <p className="text-green-600 mb-3">{success}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form
        onSubmit={submitOrgan}
        className="bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        {/* Donor Select */}
        <TextField
          label="Select Donor"
          name="donor_id"
          select
          fullWidth
          required
          value={formData.donor_id}
          onChange={handleChange}
        >
          {donors.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.name} — {d.blood_group}
            </MenuItem>
          ))}
        </TextField>

        {/* Hospital ID */}
        <TextField
          label="Hospital ID"
          name="hospital_id"
          fullWidth
          required
          value={formData.hospital_id}
          onChange={handleChange}
        />

        {/* Organ Type */}
        <TextField
          label="Organ Type"
          name="organ_type"
          select
          required
          fullWidth
          value={formData.organ_type}
          onChange={handleChange}
        >
          <MenuItem value="HEART">Heart</MenuItem>
          <MenuItem value="LIVER">Liver</MenuItem>
          <MenuItem value="KIDNEY">Kidney</MenuItem>
          <MenuItem value="LUNGS">Lungs</MenuItem>
        </TextField>

        {/* Blood Group */}
        <TextField
          label="Blood Group"
          name="blood_group"
          select
          required
          fullWidth
          value={formData.blood_group}
          onChange={handleChange}
        >
          {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
            <MenuItem key={bg} value={bg}>
              {bg}
            </MenuItem>
          ))}
        </TextField>

        {/* HLA */}
        <TextField
          label="HLA Code (comma separated)"
          name="hla_code"
          fullWidth
          value={formData.hla_code}
          onChange={handleChange}
        />

        {/* Condition */}
        <TextField
          label="Organ Condition"
          name="condition"
          fullWidth
          required
          placeholder="GOOD / FAIR / DAMAGED"
          value={formData.condition}
          onChange={handleChange}
        />

        {/* Submit Button */}
        <Button type="submit" fullWidth variant="contained">
          Register Organ
        </Button>
      </form>
    </div>
  );
}
