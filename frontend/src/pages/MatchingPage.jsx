import React, { useState, useEffect } from "react";
import axios from "axios";
import MatchResultCard from "../components/MatchResultCard";
import AllocateOrganModal from "../components/AllocateOrganModal";

export default function MatchingPage() {
  const [organs, setOrgans] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allocateData, setAllocateData] = useState(null);

  // Load Available Organs
  useEffect(() => {
    loadOrgans();
  }, []);

  const loadOrgans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/organs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrgans(res.data);
    } catch (err) {
      console.error("Failed to load organs:", err);
    }
  };

  // Run Matching Algorithm
  const runMatching = async () => {
    if (!selectedOrgan) return;

    setLoading(true);
    setResults([]);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3001/api/matches/run",
        { organ_id: selectedOrgan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.rankings);
    } catch (err) {
      console.error("MATCH ERROR:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Organ Matching</h1>

      {/* Organ Selector */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-3 rounded-lg w-80"
          value={selectedOrgan}
          onChange={(e) => setSelectedOrgan(e.target.value)}
        >
          <option value="">Select Organ</option>
          {organs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.organ_type} — {o.id}
            </option>
          ))}
        </select>

        <button
          onClick={runMatching}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Run Matching
        </button>
      </div>

      {/* Results Section */}
      {loading && <p className="text-xl">Running algorithm...</p>}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          {results.map((match, idx) => (
            <MatchResultCard
              key={idx}
              data={match}
              onAllocate={() =>
                setAllocateData({
                  organ_id: selectedOrgan,
                  recipient_id: match.recipient.id,
                })
              }
            />
          ))}
        </div>
      )}

      {/* Allocation Modal */}
      {allocateData && (
        <AllocateOrganModal
          data={allocateData}
          onClose={() => setAllocateData(null)}
          onAllocated={() => {
            setAllocateData(null);
            loadOrgans();
            setResults([]);
          }}
        />
      )}
    </div>
  );
}
