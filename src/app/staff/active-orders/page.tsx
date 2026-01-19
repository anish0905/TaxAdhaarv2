import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { FileText, ChevronRight, User, CheckCircle2 } from "lucide-react";

export default async function StaffActiveOrders() {
  const session = await getServerSession(authOptions);
  await connectDB();

  // Sirf wo orders jo is staff ko assigned hain aur payment ho chuki hai
  const staffOrders = await Order.find({
    assignedSalesId: session?.user?.id,
    paymentStatus: "paid"
  }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black italic uppercase text-slate-900 mb-8">
          Processing <span className="text-blue-600">Queue</span>
        </h1>

        <div className="grid gap-6">
          {staffOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {order.serviceType.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-green-100 text-green-600 text-[8px] font-black uppercase px-2 py-0.5 rounded">Payment Done</span>
                    <span className="text-slate-400 text-[9px] font-bold">#{String(order._id).slice(-6).toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">{order.clientName}</h3>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">{order.serviceType}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="text-right hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase">Documents</p>
                    <p className="text-sm font-black text-slate-900">{order.documents?.length || 0} Files</p>
                 </div>
                 <Link 
                   href={`/staff/orders/${order._id}`}
                   className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                 >
                   Process Order <ChevronRight size={16} />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}