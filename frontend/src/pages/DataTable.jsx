import React from "react";

export default function DataTable({ columns, data, actions }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data?.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-10 text-center text-gray-400 italic">
                  No records found.
                </td>
              </tr>
            ) : (
              data?.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors duration-150">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                      {/* Handle complex cell rendering if needed, otherwise plain text */}
                      {row[col.key]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer pagination placeholder */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
        <span className="text-xs text-gray-400">Showing {data?.length || 0} entries</span>
      </div>
    </div>
  );
}