import React from "react";

export default function MatchResultCard({ match, onAllocate }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border">

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Organ: {match.organ_type} — Match Score:  
          <span 
            className={
              match.score >= 80
                ? "text-green-600"
                : match.score >= 50
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {match.score}%
          </span>
        </h3>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onAllocate}
        >
          Allocate
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4">

        <div>
          <h4 className="font-semibold">Donor Details</h4>
          <p>Name: {match.donor_name}</p>
          <p>Blood Group: {match.donor_blood}</p>
        </div>

        <div>
          <h4 className="font-semibold">Recipient Details</h4>
          <p>Name: {match.recipient_name}</p>
          <p>Blood Group: {match.recipient_blood}</p>
          <p>Organ Needed: {match.organ_needed}</p>
        </div>
      </div>
    </div>
  );
}
