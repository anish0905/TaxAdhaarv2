import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import Link from "next/link";
import { Clock, Eye, FileText, User } from "lucide-react";

export default async function AdminDashboard() {
  await connectDB();
  
  // Jo orders review ke liye pending hain unhe fetch karein
  const pendingOrders = await Order.find({ status: "under_review" })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">CA Review Panel</h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Manage incoming filings & billing</p>
          </div>
          <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest">
            Pending: {pendingOrders.length}
          </div>
        </div>

        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Client / ID</th>
                <th className="px-8 py-6">Service Type</th>
                <th className="px-8 py-6">Docs</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black italic">
                        {order.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm uppercase">{order.clientName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">#{String(order._id).slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-700 uppercase">{order.serviceType}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-blue-600">
                      <FileText size={14} />
                      <span className="text-xs font-black">{order.documents.length} Files</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-400 uppercase">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link 
                      href={`/admin/dashboard/admin/review/${order._id}`}
                      className="inline-flex items-center gap-2 bg-[#020617] text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      <Eye size={12} /> Review & Bill
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {pendingOrders.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
              No new applications for review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}