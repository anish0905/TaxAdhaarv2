import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Search, History, Eye, Download, FileCheck, Filter } from "lucide-react";

export default async function StaffOrderCompleted({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; page?: string }> 
}) {
  const { q, page } = await searchParams;
  const session = await getServerSession(authOptions);
  await connectDB();

  const currentPage = Number(page) || 1;
  const limit = 10; // Ek page par 10 orders
  const skip = (currentPage - 1) * limit;

  // Search query logic
  const query: any = {
    assignedSalesId: session?.user?.id,
    status: "completed" // Sirf completed orders
  };

  if (q) {
    query.$or = [
      { clientName: { $regex: q, $options: "i" } },
      { serviceType: { $regex: q, $options: "i" } }
    ];
  }

  const [orders, totalOrders] = await Promise.all([
    Order.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Service <span className="text-emerald-600">Completed</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
              <FileCheck size={14} className="text-emerald-500" /> All your successfully filed applications
            </p>
          </div>

          {/* SEARCH BAR */}
          <form className="relative w-full md:w-96 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              name="q"
              defaultValue={q}
              placeholder="Search by Client or Service..." 
              className="w-full bg-white border border-slate-200 py-4 pl-14 pr-6 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </form>
        </div>

        {/* ORDERS LIST */}
        <div className="grid gap-4">
          {orders.length > 0 ? (
            orders.map((order: any) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row items-center justify-between gap-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="flex items-center gap-6 w-full lg:w-auto">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner border border-emerald-100">
                    {order.serviceType.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-100 text-emerald-600 text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Completed</span>
                      <span className="text-slate-400 text-[9px] font-bold">#{String(order._id).slice(-8).toUpperCase()}</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase italic leading-none">{order.clientName}</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{order.serviceType}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-none pt-4 lg:pt-0">
                   <div className="text-left lg:text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Completion Date</p>
                      <p className="text-[11px] font-bold text-slate-600 italic">{new Date(order.updatedAt).toLocaleDateString()}</p>
                   </div>
                   
                   <div className="flex gap-2">
                     <Link 
                        href={`/staff/orders/${order._id}`}
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <button 
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        title="Download Receipt"
                      >
                        <Download size={18} />
                      </button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
               <History size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No completed records found</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/staff/history?page=${i + 1}${q ? `&q=${q}` : ''}`}
                className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xs transition-all ${
                  currentPage === i + 1 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "bg-white text-slate-400 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}