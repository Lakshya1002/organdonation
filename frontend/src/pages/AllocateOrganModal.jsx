import React, { useState } from "react";
import axiosClient from "../api/axiosClient";

export default function AllocateOrganModal({ match, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const allocateOrgan = async () => {
    setLoading(true);
    try {
      await axiosClient.post("/matching/allocate", {
        organ_id: match.organ_id,
        recipient_id: match.recipient_id,
      });

      alert("Organ allocated successfully!");
      onSuccess();
    } catch (err) {
      console.error("Allocation error:", err);
      alert("Error allocating organ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

        <h2 className="text-xl font-semibold mb-4">
          Confirm Organ Allocation
        </h2>

        <p className="mb-3">
          <strong>Organ:</strong> {match.organ_type}
        </p>
        <p className="mb-3">
          <strong>Donor:</strong> {match.donor_name}
        </p>
        <p className="mb-3">
          <strong>Recipient:</strong> {match.recipient_name}
        </p>
        <p className="mb-4">
          <strong>Match Score:</strong> {match.score}%
        </p>

        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={allocateOrgan}
            disabled={loading}
          >
            {loading ? "Allocating..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  );
}
