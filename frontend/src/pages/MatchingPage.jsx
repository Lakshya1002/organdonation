import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

export default function Matching() {
  const [organs, setOrgans] = useState([]);
  const [selectedOrganId, setSelectedOrganId] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [matchRun, setMatchRun] = useState(false);

  // 1. Load Available Organs
  const loadOrgans = async () => {
    try {
      const res = await axiosClient.get("/organs?status=AVAILABLE");
      setOrgans(res.data);
    } catch (err) {
      toast.error("Failed to load organs");
    }
  };

  useEffect(() => {
    loadOrgans();
  }, []);

  // 2. Run Matching
  const runMatching = async (organId) => {
    if(!organId) return;
    setLoading(true);
    setMatchRun(true);
    try {
      const res = await axiosClient.post("/matching/run", { organ_id: organId });
      setMatches(res.data.matches || []);
      if(res.data.matches.length === 0) toast("No compatible recipients found", { icon: "⚠️" });
    } catch (err) {
      toast.error("Matching algorithm failed");
    } finally {
      setLoading(false);
    }
  };

  // 3. Allocate Organ
  const handleAllocate = async (match) => {
    if (!window.confirm(`Allocate this organ to ${match.recipient_name}?`)) return;

    try {
      await axiosClient.post("/matching/allocate", {
        organ_id: selectedOrganId,
        recipient_id: match.recipient_id,
        final_score: match.total_score
      });
      toast.success("Organ Allocated Successfully!");
      
      // Reset
      setMatches([]);
      setSelectedOrganId("");
      loadOrgans(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Allocation failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🧬 Smart Organ Matching
      </h1>

      {/* Step 1: Select Organ */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Available Organ</label>
        <div className="flex gap-4">
          <select
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedOrganId}
            onChange={(e) => {
              setSelectedOrganId(e.target.value);
              setMatchRun(false);
              setMatches([]);
            }}
          >
            <option value="">-- Choose an Organ --</option>
            {organs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.organ_type} ({o.blood_group}) — Donor: {o.donor_name || 'Unknown'} (ID: {o.id})
              </option>
            ))}
          </select>
          
          <button
            onClick={() => runMatching(selectedOrganId)}
            disabled={!selectedOrganId || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Running AI..." : "Find Matches"}
          </button>
        </div>
      </div>

      {/* Step 2: Results */}
      {matchRun && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Matching Results ({matches.length})
          </h2>

          {matches.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No compatible recipients found for this organ.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((m, index) => (
                <div key={m.recipient_id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition">
                  {/* Card Header */}
                  <div className={`p-4 ${index === 0 ? 'bg-green-50' : 'bg-gray-50'} border-b flex justify-between items-center`}>
                    <span className="font-bold text-gray-700">#{index + 1} Best Match</span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                      Score: {m.total_score}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Recipient:</span>
                      <span className="font-semibold">{m.recipient_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Blood Group:</span>
                      <span className="font-mono bg-red-50 text-red-600 px-2 rounded">{m.blood_group}</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">Score Breakdown</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>🩸 Blood:</span> <span className="font-medium text-green-600">+{m.scores.blood}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>⚠️ Urgency:</span> <span className="font-medium text-amber-600">+{m.scores.urgency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🎂 Age:</span> <span className="font-medium text-blue-600">+{m.scores.age}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>⏳ Wait:</span> <span className="font-medium text-purple-600">+{m.scores.waiting}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAllocate(m)}
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition shadow-sm"
                    >
                      Allocate Organ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}