// src/pages/recipients/RecipientRegistration.jsx
import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

export default function RecipientRegistration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    blood_group: "",
    organ_needed: "",
    severity_level: "",
    pra_score: "",
    hla_code: "",
    crossmatch_result: "",
    status: "WAITING",
    waiting_since: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerRecipient = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/patients", form);
      alert("Recipient registered successfully!");
      navigate("/admin/recipients");
    } catch (err) {
      console.error(err);
      alert("Error registering recipient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">Register Recipient</h2>

      <form onSubmit={registerRecipient} className="space-y-4">

        {[
          { label: "Name", key: "name" },
          { label: "Age", key: "age", type: "number" },
          { label: "Gender", key: "gender" },
          { label: "Blood Group", key: "blood_group" },
          { label: "Organ Needed", key: "organ_needed" },
          { label: "Severity Level", key: "severity_level" },
          { label: "PRA Score", key: "pra_score", type: "number" },
          { label: "HLA Code", key: "hla_code" },
          { label: "Crossmatch Result", key: "crossmatch_result" },
          { label: "Waiting Since", key: "waiting_since" },
        ].map((f) => (
          <input
            key={f.key}
            type={f.type || "text"}
            name={f.key}
            placeholder={f.label}
            className="border p-2 rounded w-full"
            value={form[f.key]}
            onChange={handleChange}
            required={["name", "blood_group", "organ_needed"].includes(f.key)}
          />
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Register Recipient"}
        </button>

      </form>
    </div>
  );
}
