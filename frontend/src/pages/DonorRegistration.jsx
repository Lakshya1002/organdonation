import React, { useState } from "react";
import axios from "axios";
import { Button, TextField, MenuItem } from "@mui/material";

export default function DonorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    blood_group: "",
    hospital_id: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitDonor = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:3001/api/donors",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("Donor registered successfully!");
      setFormData({
        name: "",
        age: "",
        gender: "",
        blood_group: "",
        hospital_id: "",
      });
    } catch (err) {
      setError("Failed to register donor");
      console.error("DONOR REGISTER ERROR:", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Register Donor</h1>

      {success && <p className="text-green-600 mb-3">{success}</p>}
      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={submitDonor} className="bg-white p-6 rounded-xl shadow-lg space-y-4">

        <TextField
          label="Name"
          name="name"
          value={formData.name}
          fullWidth
          onChange={handleChange}
        />

        <TextField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          fullWidth
          onChange={handleChange}
        />

        <TextField
          label="Gender"
          name="gender"
          select
          value={formData.gender}
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value="MALE">Male</MenuItem>
          <MenuItem value="FEMALE">Female</MenuItem>
          <MenuItem value="OTHER">Other</MenuItem>
        </TextField>

        <TextField
          label="Blood Group"
          name="blood_group"
          select
          value={formData.blood_group}
          fullWidth
          onChange={handleChange}
        >
          <MenuItem value="A+">A+</MenuItem>
          <MenuItem value="A-">A-</MenuItem>
          <MenuItem value="B+">B+</MenuItem>
          <MenuItem value="B-">B-</MenuItem>
          <MenuItem value="O+">O+</MenuItem>
          <MenuItem value="O-">O-</MenuItem>
          <MenuItem value="AB+">AB+</MenuItem>
          <MenuItem value="AB-">AB-</MenuItem>
        </TextField>

        <TextField
          label="Hospital ID"
          name="hospital_id"
          value={formData.hospital_id}
          fullWidth
          onChange={handleChange}
        />

        <Button type="submit" variant="contained" fullWidth>
          Register Donor
        </Button>
      </form>
    </div>
  );
}
