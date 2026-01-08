"use client"
import { assignLeadsAction } from "@/app/actions/assignLeads";
import { useState } from "react";

export default function AssignLeadsForm({ unassignedLeads, salesStaff }: any) {
  const [loading, setLoading] = useState(false);

  // Error fix karne ke liye humne ek wrapper function banaya hai
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await assignLeadsAction(formData);
    setLoading(false);
    
    if (res?.error) alert(res.error);
    if (res?.success) alert(res.success);
  }

  return (
    <form action={handleSubmit}>
      {/* Bulk Actions Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Assign To:</span>
          <select 
            name="salesStaffId" 
            className="border p-2 rounded-lg bg-blue-50 text-blue-800 font-bold outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Choose Sales Staff --</option>
            {salesStaff.map((staff: any) => (
              <option key={staff._id} value={staff._id.toString()}>{staff.name}</option>
            ))}
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md disabled:bg-slate-400"
        >
          {loading ? "Assigning..." : "Assign Selected Leads"}
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4 text-slate-600 font-bold uppercase text-xs">Client Info</th>
              <th className="p-4 text-slate-600 font-bold uppercase text-xs">Service</th>
              <th className="p-4 text-slate-600 font-bold uppercase text-xs">Source</th>
              <th className="p-4 text-slate-600 font-bold uppercase text-xs">Date</th>
            </tr>
          </thead>
          <tbody>
            {unassignedLeads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">Sabhi leads assign ho chuki hain! ✨</td>
              </tr>
            ) : (
              unassignedLeads.map((lead: any) => (
                <tr key={lead._id} className="border-b hover:bg-blue-50/30 transition">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      name="leadIds" 
                      value={lead._id.toString()} 
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{lead.clientName}</p>
                    <p className="text-sm text-slate-500">{lead.clientPhone}</p>
                  </td>
                  <td className="p-4 text-blue-600 font-bold text-sm">{lead.serviceType}</td>
                  <td className="p-4">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">
                      {lead.salesRemarks === "Website Enquiry" ? "🌐 Website" : "📊 Excel"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </form>
  );
}