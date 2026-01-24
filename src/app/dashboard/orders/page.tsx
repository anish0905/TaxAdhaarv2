import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { redirect } from "next/navigation";
import { 
  Package, 
  ShieldCheck
} from "lucide-react";
import ClientOrdersList from "./components/ClientOrdersList";

export const dynamic = "force-dynamic";

export default async function ClientOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  await connectDB();
  
  // Client ke orders fetch karein using their email/phone
  const orders = await Order.find({ clientPhone: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  const serializedOrders = JSON.parse(JSON.stringify(orders));

  // Stats for the client
  const totalOrders = serializedOrders.length;
  const activeOrders = serializedOrders.filter((o: any) => o.status !== 'completed' && o.status !== 'rejected').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER & WELCOME */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              My <span className="text-blue-600">Applications</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-600" />
              Track your service requests and filing status
            </p>
          </div>
          
          {/* COMPACT STATS FOR CLIENT */}
          <div className="flex gap-4">
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 min-w-[120px]">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total</p>
                <p className="text-xl font-black text-slate-900 leading-none">{totalOrders}</p>
             </div>
             <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-200 min-w-[120px] text-white">
                <p className="text-[8px] font-black text-blue-200 uppercase mb-1">Active</p>
                <p className="text-xl font-black leading-none">{activeOrders}</p>
             </div>
          </div>
        </div>

        {/* ORDERS LIST LOGIC */}
        <div className="space-y-6">
          {serializedOrders.length > 0 ? (
            <ClientOrdersList initialOrders={serializedOrders} user={session.user} />
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={32} className="text-slate-200" />
               </div>
               <h3 className="text-xl font-black text-slate-900 uppercase italic">No Orders Yet</h3>
               <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                 You haven't applied for any services yet.
               </p>
               <button className="mt-8 bg-[#020617] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all">
                 Apply for New Service
               </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}