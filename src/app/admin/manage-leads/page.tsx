import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { assignLeadsAction } from "@/app/actions/assignLeadsAction"; // Check your path
import { UserPlus, ShieldCheck, CheckSquare, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminManageLeads() {
  try {
    await connectDB();

    const leadsRaw = await Order.find({
      assignedSalesId: { $exists: false },
    }).sort({ createdAt: -1 }).lean();

    const staffRaw = await User.find({ role: "sales" }).lean();

    const unassignedLeads = JSON.parse(JSON.stringify(leadsRaw));
    const salesStaff = JSON.parse(JSON.stringify(staffRaw));

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-10 min-h-screen space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Lead <span className="text-blue-600">Allocation</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> 
              Distribute pending enquiries to sales team
            </p>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase">Unassigned</p>
             <p className="text-2xl font-black text-blue-600 italic">{unassignedLeads.length}</p>
          </div>
        </div>

        {/* Form Wrapper with TS Fix */}
        <form action={async (formData) => {
          "use server";
          const res = await assignLeadsAction(formData);
          // Optional: Handle response with a toast/alert in a client component
        }}>
          
          {/* STICKY ACTION BAR */}
          <div className="bg-[#020617] p-6 rounded-[2.5rem] shadow-2xl mb-8 sticky top-24 z-30 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Users size={22} />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Target Executive</label>
                <select
                  name="salesStaffId"
                  required
                  className="bg-transparent text-white font-black uppercase text-xs focus:outline-none cursor-pointer w-full"
                >
                  <option value="" className="text-slate-900">-- Choose Executive --</option>
                  {salesStaff.map((staff: any) => (
                    <option key={staff._id} value={staff._id} className="text-slate-900">
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
              Confirm Assignment
            </button>
          </div>

          {/* TABLE UI */}
          <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b">
                <tr>
                  <th className="px-10 py-7 w-12 text-center"><CheckSquare size={16} /></th>
                  <th className="px-8 py-7">Client Identity</th>
                  <th className="px-8 py-7">Service Requested</th>
                  <th className="px-8 py-7">Enquiry Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {unassignedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <ShieldCheck size={64} />
                         <p className="font-black uppercase text-sm tracking-widest">Everything is Assigned</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  unassignedLeads.map((lead: any) => (
                    <tr key={lead._id} className="hover:bg-blue-50/40 transition-all group">
                      <td className="px-10 py-7 text-center">
                        <input
                          type="checkbox"
                          name="leadIds"
                          value={lead._id}
                          className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="px-8 py-7">
                        <p className="font-black text-slate-900 text-sm uppercase leading-none mb-1.5">{lead.clientName}</p>
                        <p className="text-[10px] text-slate-400 font-bold tracking-tight">{lead.clientPhone}</p>
                      </td>
                      <td className="px-8 py-7">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase w-fit border border-blue-100">
                          {lead.serviceType}
                        </span>
                      </td>
                      <td className="px-8 py-7">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-black text-red-500 uppercase tracking-widest">Critical: Database Link Failed</p>
      </div>
    );
  }
}