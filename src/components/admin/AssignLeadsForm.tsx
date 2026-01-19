"use client";

import { useState } from "react";
import { assignLeadsAction } from "@/app/actions/assignLeadsAction";

export default function AssignLeadsForm({ unassignedLeads, salesStaff }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      await assignLeadsAction(formData); // server action void return
      setMessage({
        type: "success",
        text: `${formData.getAll("leadIds").length} leads successfully assigned.`,
      });
      e.currentTarget.reset(); // form reset karein
    } catch (err: any) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.message || "Failed to assign leads",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Message */}
      {message && (
        <div className={`p-4 mb-4 rounded-xl text-sm font-bold border ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border-green-100"
            : "bg-red-50 text-red-700 border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center justify-between sticky top-0 z-50">
        <select name="salesStaffId" required className="border px-3 py-2 rounded-lg bg-blue-50 text-blue-800 font-bold">
          <option value="">-- Select Staff --</option>
          {salesStaff.map((s: any) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading || unassignedLeads.length === 0}
          className="bg-[#020617] text-white px-6 py-2 rounded-xl font-bold"
        >
          {loading ? "Processing..." : "Assign Selected"}
        </button>
      </div>

      {/* Leads Table */}
      <table className="w-full text-left bg-white rounded-2xl shadow-sm border overflow-hidden">
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className="p-4 w-10"></th>
            <th className="p-4 text-xs font-black uppercase text-slate-500">Client</th>
            <th className="p-4 text-xs font-black uppercase text-slate-500">Service</th>
            <th className="p-4 text-xs font-black uppercase text-slate-500">Date</th>
          </tr>
        </thead>
        <tbody>
          {unassignedLeads.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-10 text-center text-slate-400 italic">
                All leads are assigned 🎉
              </td>
            </tr>
          ) : (
            unassignedLeads.map((lead: any) => (
              <tr key={lead._id} className="border-b hover:bg-blue-50/40">
                <td className="p-4">
                  <input
                    type="checkbox"
                    name="leadIds"
                    value={lead._id.toString()}
                    className="w-4 h-4 accent-blue-600"
                  />
                </td>
                <td className="p-4">
                  <p className="font-black text-slate-900">{lead.clientName}</p>
                  <p className="text-xs text-slate-400">{lead.clientPhone}</p>
                </td>
                <td className="p-4">
                  <span className="text-[10px] font-black uppercase px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {lead.serviceType}
                  </span>
                </td>
                <td className="p-4 text-xs font-bold text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </form>
  );
}
