import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { redirect } from "next/navigation";
import { 
  CreditCard, ArrowUpRight, Download, Search, Wallet, History, AlertCircle, CheckCircle2 
} from "lucide-react";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  // 1. Fetch Dynamic Data from MongoDB
  const allOrders = await Order.find({ clientPhone: session.user.email })
    .sort({ createdAt: -1 })
    .lean();

  const serializedOrders = JSON.parse(JSON.stringify(allOrders));

  // 2. Calculate Real-time Stats
// totalPaid calculation update
const totalPaid = serializedOrders
  .filter((o: any) => o.paymentStatus === "paid")
  .reduce((acc: number, curr: any) => acc + (curr.billing?.totalAmount || 0), 0);

// totalOutstanding calculation update
const totalOutstanding = serializedOrders
  .filter((o: any) => o.paymentStatus === "pending")
  .reduce((acc: number, curr: any) => acc + (curr.billing?.totalAmount || 0), 0);

  const successCount = serializedOrders.filter((o: any) => o.paymentStatus === "paid").length;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Billing <span className="text-blue-600">& Ledger</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
            <Wallet size={14} className="text-blue-600" />
            Manage your invoices for {session.user.name}
          </p>
        </div>

        {/* Action: Redirect to services to create new order/payment */}
        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#020617] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
          <CreditCard size={18} /> Make New Payment
        </button>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Outstanding</p>
                <h2 className="text-4xl font-black italic mt-2">₹{totalOutstanding.toLocaleString()}</h2>
                {totalOutstanding > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
                      <AlertCircle size={12} /> Payment Required
                  </div>
                )}
            </div>
            <ArrowUpRight className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Paid</p>
            <h2 className="text-4xl font-black italic text-slate-900 mt-2">₹{totalPaid.toLocaleString()}</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <CheckCircle2 size={12} /> {successCount} Successful Payments
            </div>
        </div>

        {/* Action: Download Statement (Client Side Logic could be added) */}
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-all">
                <Download size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Download Statement</p>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <History size={20} />
             </div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Payment History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {serializedOrders.length > 0 ? serializedOrders.map((txn: any) => (
                <tr key={txn._id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6 text-xs font-black text-slate-400">#{txn._id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900 leading-none">{txn.serviceName}</p>
                  {/* Amount column update */}
<td className="px-8 py-6 text-sm font-black text-slate-900">
  ₹{txn.billing?.totalAmount?.toLocaleString() || "0"}
</td>

{/* Service Name column update - check if it's serviceType in your data */}
<td className="px-8 py-6">
  <p className="text-sm font-bold text-slate-900 leading-none">
    {txn.serviceType?.replace(/-/g, ' ')}
  </p>
  <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">
      {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
  </p>
</td>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">₹{txn.amount}</td>
                  <td className="px-8 py-6">
                    <PaymentStatus status={txn.paymentStatus || 'pending'} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    {txn.paymentStatus === 'paid' ? (
                      <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors">
                        <Download size={14} /> PDF
                      </button>
                    ) : (
                      <button className="text-[10px] font-black uppercase text-orange-500 hover:underline">
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PaymentStatus({ status }: { status: string }) {
  const styles: any = {
    paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    failed: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}