import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { assignLeadsAction } from "@/app/actions/assignLeads";

// --- DEPLOYMENT FIX 1: Force Dynamic Rendering ---
// Isse Next.js purana cached data nahi dikhayega balki har request pe DB check karega.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminManageLeads() {
  try {
    await connectDB();

    // --- OPTIMIZATION: Lean Queries ---
    // .lean() use karne se performance fast hoti hai aur POJO data milta hai
    const leadsRaw = await Order.find({
      assignedSalesId: { $exists: false },
    })
    .sort({ createdAt: -1 })
    .lean();

    const staffRaw = await User.find({ role: "sales" }).lean();

    // --- DEPLOYMENT FIX 2: Serialization ---
    // MongoDB ke _id object ko stringify karna zaroori hai deployment ke liye
    const unassignedLeads = JSON.parse(JSON.stringify(leadsRaw));
    const salesStaff = JSON.parse(JSON.stringify(staffRaw));

    return (
      <div className="max-w-6xl mx-auto p-4 md:p-10 min-h-screen">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
            Lead Distribution.
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
            Assign {unassignedLeads.length} pending enquiries to your sales team
          </p>
        </div>

        <form action={assignLeadsAction}>
          {/* Sticky Action Bar */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-100 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between sticky top-24 z-50 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="bg-blue-600 text-white p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 017 7v1H1v-1a7 7 0 017-7z" />
                </svg>
              </div>
              <select
                name="salesStaffId"
                required
                className="w-full md:w-64 border-none bg-slate-100/50 px-4 py-3 rounded-xl text-sm font-black text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Sales Executive</option>
                {salesStaff.map((staff: any) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto bg-[#020617] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200 transition-all active:scale-95"
            >
              Confirm Assignment
            </button>
          </div>

          {/* Optimized Table UI */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 w-12 text-center">
                    <div className="w-4 h-4 rounded border-2 border-slate-300 mx-auto" />
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Service</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Enquiry Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {unassignedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <span className="text-6xl mb-4">✨</span>
                        <p className="font-black uppercase tracking-widest text-xs">Inbox is Clean</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  unassignedLeads.map((lead: any) => (
                    <tr key={lead._id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="p-6 text-center">
                        <input
                          type="checkbox"
                          name="leadIds"
                          value={lead._id}
                          className="w-5 h-5 accent-blue-600 cursor-pointer rounded-lg"
                        />
                      </td>

                      <td className="p-6">
                        <p className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                          {lead.clientName}
                        </p>
                        <p className="text-xs font-bold text-slate-400 tracking-tighter">
                          +91 {lead.clientPhone}
                        </p>
                      </td>

                      <td className="p-6">
                        <span className="text-[10px] font-black uppercase px-4 py-2 bg-white border border-slate-100 text-slate-600 rounded-full shadow-sm group-hover:border-blue-200 group-hover:text-blue-600">
                          {lead.serviceType}
                        </span>
                      </td>

                      <td className="p-6">
                        <p className="text-xs font-bold text-slate-500">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
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
      <div className="p-20 text-center">
        <h2 className="text-red-500 font-bold">Database Connection Error</h2>
        <p className="text-slate-400 text-sm">Please check MongoDB IP Whitelisting.</p>
      </div>
    );
  }
}