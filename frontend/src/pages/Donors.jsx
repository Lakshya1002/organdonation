// src/pages/donors/Donors.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DataTable from "./DataTable";

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: "",
    age: "",
    blood_group: "",
    organ_type: "",
  });

  // Fetch donors
  const loadDonors = async () => {
    try {
      const res = await axiosClient.get("/donors");
      setDonors(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching donors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  // Search filter
  useEffect(() => {
    const result = donors.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, donors]);

  // Delete Donor
  const deleteDonor = async (id) => {
    if (!window.confirm("Delete this donor?")) return;
    try {
      await axiosClient.delete(`/donors/${id}`);
      setDonors(donors.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Add Donor
  const saveDonor = async () => {
    try {
      const res = await axiosClient.post("/donors", newDonor);
      setDonors([...donors, { id: res.data.id, ...newDonor }]);
      setShowModal(false);
      setNewDonor({ name: "", age: "", blood_group: "", organ_type: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { label: "Name", key: "name" },
    { label: "Age", key: "age" },
    { label: "Blood Group", key: "blood_group" },
    { label: "Organ Donated", key: "organ_type" },
  ];

  if (loading) return <p>Loading donors...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Donors</h1>

      {/* Search + Add Button */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search donor..."
          className="border p-2 rounded w-60"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Donor
        </button>
      </div>

      {/* Donor Table */}
      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => deleteDonor(row.id)}
            >
              Delete
            </button>
          </>
        )}
      />

      {/* Add Donor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Donor</h2>

            <input
              type="text"
              placeholder="Name"
              className="border p-2 w-full mb-3 rounded"
              value={newDonor.name}
              onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
            />

            <input
              type="number"
              placeholder="Age"
              className="border p-2 w-full mb-3 rounded"
              value={newDonor.age}
              onChange={(e) => setNewDonor({ ...newDonor, age: e.target.value })}
            />

            <input
              type="text"
              placeholder="Blood Group (e.g., A+)"
              className="border p-2 w-full mb-3 rounded"
              value={newDonor.blood_group}
              onChange={(e) =>
                setNewDonor({ ...newDonor, blood_group: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Organ Type"
              className="border p-2 w-full mb-3 rounded"
              value={newDonor.organ_type}
              onChange={(e) =>
                setNewDonor({ ...newDonor, organ_type: e.target.value })
              }
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveDonor}
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
