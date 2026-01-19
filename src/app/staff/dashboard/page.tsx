import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  Search,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StaffFirstPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);
  await connectDB();

  const staffId = session?.user?.id;
  // Next.js 15 safe unwrap for searchParams agar error aaye toh:
  const queryParam = await searchParams;
  const searchQuery = queryParam.q || "";

  // 1. Stats Calculation (Specifically for Staff's clients)
  const totalClients = await Order.countDocuments({ assignedSalesId: staffId });
  const pendingProcessing = await Order.countDocuments({ 
    assignedSalesId: staffId, 
    paymentStatus: "paid",
    status: { $ne: "completed" } 
  });
  const completedFilings = await Order.countDocuments({ 
    assignedSalesId: staffId, 
    status: "completed" 
  });

  // 2. Active Processing Queue Query
  const query: any = {
    assignedSalesId: staffId,
    paymentStatus: "paid",
    status: { $ne: "completed" }
  };

  if (searchQuery) {
    query.$or = [
      { clientName: { $regex: searchQuery, $options: "i" } },
      { clientPhone: { $regex: searchQuery, $options: "i" } }
    ];
  }

  const activeQueue = await Order.find(query)
    .sort({ updatedAt: -1 })
    .limit(15)
    .lean();

  return (
    <div className="space-y-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Processing <span className="text-blue-600">Console</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-600" />
            Managing active clients for {session?.user?.name || "Team Member"}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">Live Status</span>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Total My Clients" val={totalClients} icon={<LayoutDashboard size={20} />} color="blue" />
        <StatCard label="Pending Processing" val={pendingProcessing} icon={<Clock size={20} />} color="orange" />
        <StatCard label="Completed Filings" val={completedFilings} icon={<CheckCircle size={20} />} color="emerald" />
      </div>

      {/* ACTIVE CLIENTS TABLE */}
      <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase italic">Paid Clients Queue</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ready for document filing</p>
            </div>
          </div>
          
          <form className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <input 
               type="text" 
               name="q"
               defaultValue={searchQuery}
               placeholder="Search by Client Name or Email..." 
               className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl text-xs font-bold border border-slate-100 focus:ring-2 focus:ring-blue-500 text-slate-900 shadow-sm"
             />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b">
              <tr>
                <th className="px-10 py-6">Client Identity</th>
                <th className="px-8 py-6">Service Category</th>
                <th className="px-8 py-6">Documentation</th>
                <th className="px-8 py-6 text-right">Task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeQueue.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <AlertCircle size={56} className="text-slate-400" />
                      <p className="font-black uppercase text-sm tracking-tighter text-slate-900">No active paid clients in your queue</p>
                    </div>
                  </td>
                </tr>
              ) : (
                activeQueue.map((order: any) => (
                  <tr key={order._id.toString()} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-blue-600 text-xs shadow-inner">
                          {order.clientName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase leading-none mb-1.5 group-hover:text-blue-600 transition-colors">{order.clientName}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{order.clientPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-7">
                      <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100">
                        {order.serviceType?.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-8 py-7">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-black text-slate-900 italic">
                          {order.documents?.length || 0} <span className="text-[10px] text-slate-400 not-italic uppercase font-bold ml-1">Attachments</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-7 text-right">
                      <Link 
                        href={`/staff/orders/${order._id.toString()}`}
                        className="inline-flex items-center gap-2 bg-[#020617] text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                      >
                        Open Files <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, val, icon, color }: any) {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border ${colorMap[color]} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
      <div className={`w-12 h-12 ${colorMap[color]} border rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 italic mt-1">{val}</h3>
    </div>
  );
}