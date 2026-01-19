import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import Link from "next/link";
import { CheckCircle, Clock, IndianRupee, Eye, ArrowLeft } from "lucide-react";

export default async function CAReviewedHistory() {
  await connectDB();

  // Wo orders fetch karein jinhe CA review kar chuka hai
  const reviewedOrders = await Order.find({
    status: { $in: ["payment_pending", "in-progress", "completed"] }
  }).sort({ "billing.billingDate": -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <Link href="/dashboard/admin" className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4">
              <ArrowLeft size={14} /> Back to Pending
            </Link>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Review <span className="text-blue-600">History</span></h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2">Orders processed by you</p>
          </div>
          <div className="bg-white px-8 py-4 rounded-[2rem] shadow-sm border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase">Total Reviewed</p>
             <p className="text-2xl font-black text-slate-900">{reviewedOrders.length}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#020617] text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Client & Service</th>
                <th className="px-8 py-6">Bill Generated</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Payment</th>
                <th className="px-8 py-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {reviewedOrders.map((order: any) => (
                <tr key={order._id} className="hover:bg-slate-50/80 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-blue-600">
                        {order.serviceType.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xs uppercase">{order.clientName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{order.serviceType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-slate-900 font-black text-sm italic">
                      <IndianRupee size={12} />
                      {order.billing?.totalAmount}
                    </div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">On {new Date(order.billing?.billingDate).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      order.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-orange-400'}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-700">
                        {order.paymentStatus === 'paid' ? 'Received' : 'Awaiting'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link href={`/dashboard/admin/review/${order._id}`} className="p-3 bg-slate-100 rounded-xl inline-block hover:bg-blue-600 hover:text-white transition-all">
                      <Eye size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {reviewedOrders.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">
              You haven't reviewed any orders yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}