// src/pages/organs/Organs.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DataTable from "./DataTable";

export default function Organs() {
  const [organs, setOrgans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [organData, setOrganData] = useState({
    organ_type: "",
    donor_id: "",
    blood_group: "",
    status: "AVAILABLE",
    expiry_time: "",
  });

  // Load organs
  const loadOrgans = async () => {
    try {
      const res = await axiosClient.get("/organs");
      setOrgans(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Organ fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgans();
  }, []);

  // Search filtering
  useEffect(() => {
    const result = organs.filter((o) =>
      o.organ_type.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, organs]);

  // Delete organ
  const deleteOrgan = async (id) => {
    if (!window.confirm("Delete this organ?")) return;

    try {
      await axiosClient.delete(`/organs/${id}`);
      setOrgans(organs.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Add Organ
  const saveOrgan = async () => {
    try {
      const res = await axiosClient.post("/organs", organData);
      setOrgans([...organs, { id: res.data.id, ...organData }]);
      setShowModal(false);

      setOrganData({
        organ_type: "",
        donor_id: "",
        blood_group: "",
        status: "AVAILABLE",
        expiry_time: "",
      });
    } catch (err) {
      console.error("Error saving organ:", err);
    }
  };

  // Update Organ Status
  const updateStatus = async (id, status) => {
    try {
      await axiosClient.put(`/organs/${id}/status`, { status });
      setOrgans(
        organs.map((o) =>
          o.id === id ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const columns = [
    { label: "Organ", key: "organ_type" },
    { label: "Donor ID", key: "donor_id" },
    { label: "Blood Group", key: "blood_group" },
    { label: "Status", key: "status" },
    { label: "Expiry Time", key: "expiry_time" },
  ];

  if (loading) return <p>Loading organs...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organs</h1>

      {/* Search + Add Button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search organ type..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Organ
        </button>
      </div>

      {/* Organ Table */}
      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <div className="flex gap-2">
            {/* Update Status Dropdown */}
            <select
              className="border p-1 rounded"
              value={row.status}
              onChange={(e) => updateStatus(row.id, e.target.value)}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="MATCHED">MATCHED</option>
              <option value="TRANSPLANTED">TRANSPLANTED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>

            {/* Delete Button */}
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteOrgan(row.id)}
            >
              Delete
            </button>
          </div>
        )}
      />

      {/* Add Organ Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add Organ</h2>

            {[
              { label: "Organ Type", key: "organ_type" },
              { label: "Donor ID", key: "donor_id" },
              { label: "Blood Group", key: "blood_group" },
              { label: "Expiry Time (YYYY-MM-DD HH:MM:SS)", key: "expiry_time" },
            ].map((field) => (
              <input
                key={field.key}
                type="text"
                placeholder={field.label}
                className="border p-2 w-full mb-3 rounded"
                value={organData[field.key]}
                onChange={(e) =>
                  setOrganData({ ...organData, [field.key]: e.target.value })
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
                className="px-4 py-2 bg-purple-600 text-white rounded"
                onClick={saveOrgan}
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
