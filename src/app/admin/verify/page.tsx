import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import Link from "next/link";

export default async function AdminVerifyQueue() {
  await connectDB();
  
  // Sales ne confirm kiya par price abhi set nahi hui
  const pendingPricing = await Order.find({ 
    leadStatus: 'confirmed', 
    isVerified: false 
  }).sort({ updatedAt: -1 });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">✅ Verification Queue</h1>
        <p className="text-slate-500 font-medium italic">Confirmed leads ka pricing set karein taaki client payment kar sake.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4">Client Details</th>
              <th className="p-4">Service</th>
              <th className="p-4">Sales Remarks</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingPricing.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400">
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-4">☕</span>
                    <p className="text-lg font-bold uppercase tracking-widest">No leads pending for verification</p>
                  </div>
                </td>
              </tr>
            ) : (
              pendingPricing.map((order) => (
                <tr key={order._id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{order.clientName}</p>
                    <p className="text-sm text-slate-500">{order.clientPhone}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {order.serviceType}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 italic">
                    "{order.salesRemarks || 'No remarks added'}"
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      href={`/admin/verify/${order._id}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 shadow-md transition"
                    >
                      Set Price & Verify
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}