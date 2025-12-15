// src/pages/recipients/Recipients.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DataTable from "./DataTable";

export default function Recipients() {
  const [recipients, setRecipients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [recipient, setRecipient] = useState({
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

  // Fetch recipients
  const loadRecipients = async () => {
    try {
      const res = await axiosClient.get("/patients");
      setRecipients(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Recipient fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  // Search filtering
  useEffect(() => {
    const result = recipients.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, recipients]);

  // Delete recipient
  const deleteRecipient = async (id) => {
    if (!window.confirm("Delete this recipient?")) return;

    try {
      await axiosClient.delete(`/patients/${id}`);
      setRecipients(recipients.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Save new recipient
  const saveRecipient = async () => {
    try {
      const res = await axiosClient.post("/patients", recipient);
      setRecipients([...recipients, { id: res.data.id, ...recipient }]);
      setShowModal(false);

      // Reset form
      setRecipient({
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
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Gender", key: "gender" },
    { label: "Blood Group", key: "blood_group" },
    { label: "Organ Needed", key: "organ_needed" },
    { label: "Severity", key: "severity_level" },
    { label: "PRA", key: "pra_score" },
    { label: "Status", key: "status" },
  ];

  if (loading) return <p>Loading recipients...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Recipients</h1>

      {/* Search + Add Button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search recipient..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Recipient
        </button>
      </div>

      {/* Recipients Table */}
      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteRecipient(row.id)}
            >
              Delete
            </button>
          </>
        )}
      />

      {/* Add Recipient Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[500px] overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Add Recipient</h2>

            {/* FORM FIELDS */}
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
              { label: "Waiting Since (YYYY-MM-DD)", key: "waiting_since" },
            ].map((field) => (
              <input
                key={field.key}
                type={field.type || "text"}
                placeholder={field.label}
                className="border p-2 w-full mb-3 rounded"
                value={recipient[field.key]}
                onChange={(e) =>
                  setRecipient({ ...recipient, [field.key]: e.target.value })
                }
              />
            ))}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={saveRecipient}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
