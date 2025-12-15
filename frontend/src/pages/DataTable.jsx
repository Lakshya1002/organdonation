import React from "react";

export default function DataTable({ columns, data, actions }) {
  return (
    <div className="bg-white shadow rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-3 font-semibold text-gray-600">
                {col.label}
              </th>
            ))}
            {actions && <th className="p-3 font-semibold">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data?.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="p-4 text-center text-gray-500">
                No data available
              </td>
            </tr>
          )}

          {data?.map((row) => (
            <tr key={row.id} className="border-b last:border-none">
              {columns.map((col) => (
                <td key={col.key} className="p-3">
                  {row[col.key]}
                </td>
              ))}

              {actions && (
                <td className="p-3 flex gap-2">
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
