import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
export const dynamic = "force-dynamic";


export default async function AdminMasterLeads() {
  await connectDB();

  // Saari leads fetch karein
  // Note: assignedSalesId schema mein hona zaroori hai
  const allLeads = await Order.find()
    .populate("assignedSalesId", "name")
    .sort({ createdAt: -1 })
    .lean();

  // Summary calculation with safety checks
  const stats = {
    total: allLeads.length,
    confirmed: allLeads.filter((l: any) => l.leadStatus === 'confirmed').length,
    pending: allLeads.filter((l: any) => !l.leadStatus || l.leadStatus === 'pending').length,
    called: allLeads.filter((l: any) => l.leadStatus === 'called').length,
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Master <span className="text-blue-600">Leads</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Centralized Sales & Operations Tracking</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 font-black text-xs uppercase tracking-widest">
            Total Pipeline: {stats.total}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Pending" value={stats.pending} color="blue" />
          <StatCard label="In Progress" value={stats.called} color="yellow" />
          <StatCard label="Confirmed" value={stats.confirmed} color="green" />
          <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl text-white">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Conversion Rate</p>
            <p className="text-3xl font-black italic">
              {stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>

        {/* Master Table */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="p-6">Submission Date</th>
                  <th className="p-6">Client / Phone</th>
                  <th className="p-6">Service</th>
                  <th className="p-6">Sales Agent</th>
                  <th className="p-6">Lead Status</th>
                  <th className="p-6">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allLeads.map((lead: any) => (
                  <tr key={lead._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="p-6">
                      <p className="text-xs font-bold text-slate-400">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </td>
                    <td className="p-6">
                      <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{lead.clientName || 'Unknown User'}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{lead.clientPhone || 'No Contact'}</p>
                    </td>
                    <td className="p-6">
                      <span className="text-[11px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-3 py-1 rounded-lg">
                        {lead.serviceType}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        <span className="text-[11px] font-black uppercase text-slate-600">
                          {lead.assignedSalesId?.name || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm ${
                        lead.leadStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                        lead.leadStatus === 'called' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {lead.leadStatus ? lead.leadStatus.toUpperCase() : 'PENDING'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className={`font-black italic text-sm ${lead.paymentStatus === 'paid' ? 'text-green-600' : 'text-slate-900'}`}>
                          ₹{lead.quotedAmount || lead.billing?.totalAmount || 0}
                        </span>
                        <span className="text-[8px] font-black uppercase opacity-40">{lead.paymentStatus || 'unpaid'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {allLeads.length === 0 && (
            <div className="p-20 text-center font-black text-slate-300 uppercase italic tracking-widest">
              No leads available in the master database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Sub-Component for Clean Code
function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: any = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    yellow: "bg-yellow-50 border-yellow-100 text-yellow-600",
    green: "bg-green-50 border-green-100 text-green-600",
  };
  
  return (
    <div className={`${colors[color]} p-6 rounded-[2rem] border shadow-sm`}>
      <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-70">{label}</p>
      <p className="text-4xl font-black italic tracking-tighter">{value}</p>
    </div>
  );
}