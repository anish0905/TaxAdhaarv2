"use client"
import { assignLeadsAction } from "@/app/actions/assignLeads";
import { useState } from "react";

export default function AssignLeadsForm({ unassignedLeads, salesStaff }: any) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Wrapper function jo TypeScript error ko bypass karega
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    
    const res = await assignLeadsAction(formData);
    setLoading(false);
    
    if (res?.error) setMessage({ type: 'error', text: res.error });
    if (res?.success) {
      setMessage({ type: 'success', text: res.success });
      // Form reset karne ke liye page refresh ya state clear kar sakte hain
    }
  }

  return (
    <form action={handleSubmit}>
      {message && (
        <div className={`p-4 mb-4 rounded-xl text-sm font-bold border ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      {/* Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">Assign To:</span>
          <select 
            name="salesStaffId" 
            className="border p-2 rounded-lg bg-blue-50 text-blue-800 font-bold outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Select Staff --</option>
            {salesStaff.map((staff: any) => (
              <option key={staff._id} value={staff._id.toString()}>{staff.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || unassignedLeads.length === 0}
          className="bg-[#020617] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl disabled:bg-slate-300"
        >
          {loading ? "Processing..." : "Assign Selected"}
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 w-10"></th>
              <th className="p-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Client</th>
              <th className="p-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Service</th>
              <th className="p-5 text-slate-400 font-black uppercase text-[10px] tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {unassignedLeads.map((lead: any) => (
              <tr key={lead._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="p-5">
                  <input type="checkbox" name="leadIds" value={lead._id} className="w-4 h-4 rounded accent-blue-600" />
                </td>
                <td className="p-5">
                  <p className="font-black text-slate-900 tracking-tight">{lead.clientName}</p>
                  <p className="text-xs font-bold text-slate-400">{lead.clientPhone}</p>
                </td>
                <td className="p-5">
                  <span className="text-[10px] font-black uppercase px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    {lead.serviceType}
                  </span>
                </td>
                <td className="p-5 text-xs font-bold text-slate-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}