"use client";
import { useState } from "react";
import UpdateLeadModal from "./UpdateLeadModal";

export default function SalesTable({ leads }: { leads: any[] }) {
  const [selectedLead, setSelectedLead] = useState<any>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 text-black">Client Name</th>
            <th className="p-4 text-black">Phone</th>
            <th className="p-4 text-black">Status</th>
            <th className="p-4 text-black">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 && (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-400">
                No leads assigned.
              </td>
            </tr>
          )}

          {leads.map((lead) => (
            <tr key={lead._id} className="border-b hover:bg-gray-50">
              <td className="p-4 font-medium text-black">{lead.clientName || "N/A"}</td>
              <td className="p-4 text-black">{lead.clientPhone || "No Phone"}</td>
              <td className="p-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                  {lead.leadStatus}
                </span>
              </td>
              <td className="p-4 flex gap-2">
                <a
                  href={`https://wa.me/${lead.clientPhone}`}
                  target="_blank"
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                >
                  WhatsApp
                </a>
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Update Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLead && (
        <UpdateLeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
}
  