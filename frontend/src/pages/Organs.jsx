// src/pages/organs/Organs.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import DataTable from "./DataTable";
import toast from "react-hot-toast";

export default function Organs() {
  const [organs, setOrgans] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [organData, setOrganData] = useState({
    organ_type: "KIDNEY",
    donor_id: "",
    blood_group: "",
    condition: "GOOD",
  });

  const loadOrgans = async () => {
    try {
      const res = await axiosClient.get("/organs");
      setOrgans(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to fetch organs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrgans();
  }, []);

  useEffect(() => {
    const result = organs.filter((o) =>
      o.organ_type.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, organs]);

  const saveOrgan = async () => {
    if(!organData.donor_id || !organData.blood_group) return toast.error("Please fill all fields");
    try {
      const res = await axiosClient.post("/organs", organData);
      setOrgans([res.data, ...organs]); // Ideally re-fetch or construct object
      setShowModal(false);
      toast.success("Organ Registered!");
      loadOrgans();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error saving organ");
    }
  };

  // FIXED: Update Status Function
  const updateStatus = async (id, status) => {
    try {
      // Corrected Route: PUT /organs/:id
      await axiosClient.put(`/organs/${id}`, { status });
      setOrgans(organs.map((o) => o.id === id ? { ...o, status } : o));
      toast.success("Status Updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const deleteOrgan = async (id) => {
    if (!window.confirm("Delete this organ?")) return;
    try {
      await axiosClient.delete(`/organs/${id}`);
      setOrgans(organs.filter((o) => o.id !== id));
      toast.success("Organ Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const columns = [
    { label: "ID", key: "id" },
    { label: "Organ", key: "organ_type" },
    { label: "Blood", key: "blood_group" },
    { label: "Donor", key: "donor_name" }, // Requires backend join
    { label: "Expiry", key: "expiry_time" },
  ];

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Organ Management</h1>

      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search organ type..."
          className="border border-gray-300 p-2 rounded-lg w-64 focus:ring-2 focus:ring-purple-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium transition"
          onClick={() => setShowModal(true)}
        >
          + Add Organ
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        actions={(row) => (
          <div className="flex items-center gap-2">
            <select
              className={`text-sm border rounded p-1 ${
                row.status === 'AVAILABLE' ? 'bg-green-50 text-green-700 border-green-200' : 
                row.status === 'ALLOCATED' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50'
              }`}
              value={row.status}
              onChange={(e) => updateStatus(row.id, e.target.value)}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ALLOCATED">ALLOCATED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>

            <button
              className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 text-sm"
              onClick={() => deleteOrgan(row.id)}
            >
              Delete
            </button>
          </div>
        )}
      />

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
            <h2 className="text-xl font-bold mb-4">Register New Organ</h2>
            
            <div className="space-y-3">
              <select 
                className="w-full border p-2 rounded"
                value={organData.organ_type}
                onChange={e => setOrganData({...organData, organ_type: e.target.value})}
              >
                <option value="KIDNEY">Kidney</option>
                <option value="LIVER">Liver</option>
                <option value="HEART">Heart</option>
                <option value="LUNGS">Lungs</option>
              </select>

              <input 
                placeholder="Donor ID" 
                className="w-full border p-2 rounded"
                value={organData.donor_id}
                onChange={e => setOrganData({...organData, donor_id: e.target.value})}
              />

              <input 
                placeholder="Blood Group (e.g. A+)" 
                className="w-full border p-2 rounded uppercase"
                value={organData.blood_group}
                onChange={e => setOrganData({...organData, blood_group: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={saveOrgan}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Save Organ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}