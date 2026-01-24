import connectDB from "@/lib/db";
import { Withdrawal } from "@/models/Withdrawal";
import { User } from "@/models/User";
import { 
  CheckCircle, XCircle, Wallet, 
  ExternalLink, IndianRupee, Clock 
} from "lucide-react";
import { approvePayoutAction, rejectPayoutAction } from "@/app/actions/adminActions";

export default async function AdminWithdrawals() {
  await connectDB();
  
  // Pending requests ko fetch karein
  const requests = await Withdrawal.find({ status: "pending" })
    .populate("userId", "name email referralCode")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
              Payout <span className="text-blue-600">Requests</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
              <Clock size={14} className="text-amber-500" /> Pending Agent Commissions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {requests.map((req: any) => (
            <div key={req._id} className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-10 items-center animate-in fade-in slide-in-from-bottom-4">
              
              {/* LEFT: AMOUNT CARD */}
              <div className="w-full lg:w-48 h-40 bg-[#020617] rounded-[2rem] flex flex-col items-center justify-center text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase text-blue-400 mb-1">Requested</p>
                 <h2 className="text-3xl font-black italic">₹{req.amount.toLocaleString()}</h2>
                 <div className="mt-4 flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                    <Wallet size={12} className="text-emerald-400" />
                    <span className="text-[8px] font-black uppercase">Wallet Withdrawal</span>
                 </div>
              </div>

              {/* CENTER: AGENT & PAYMENT DETAILS */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <h3 className="text-2xl font-black uppercase italic text-slate-900 leading-none">
                    {req.userId?.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">
                    Agent ID: {req.userId?.referralCode} • {req.userId?.email}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 inline-block">
                   <p className="text-[8px] font-black text-blue-600 uppercase mb-1">UPI ADDRESS (Transfer Here)</p>
                   <p className="text-sm font-black text-slate-900 tracking-tight">{req.upiId}</p>
                </div>
              </div>

              {/* RIGHT: ADMIN ACTIONS */}
         

{/* RIGHT: ADMIN ACTIONS */}
<div className="w-full lg:w-auto flex flex-col gap-3">
  
  {/* APPROVE FORM */}
  <form action={async (formData: FormData) => {
    "use server";
    await approvePayoutAction(formData);
  }}>
    <input type="hidden" name="reqId" value={req._id.toString()} />
    <button 
      type="submit" 
      className="w-full lg:w-48 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
    >
      <CheckCircle size={16} /> Mark as Paid
    </button>
  </form>

  {/* REJECT FORM */}
  <form action={async (formData: FormData) => {
    "use server";
    await rejectPayoutAction(formData);
  }}>
    <input type="hidden" name="reqId" value={req._id.toString()} />
    <button 
      type="submit" 
      className="w-full lg:w-48 bg-white border border-rose-100 text-rose-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95"
    >
      <XCircle size={16} /> Reject Request
    </button>
  </form>

</div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-black uppercase text-sm tracking-widest italic">
                No pending payout requests. All agents are settled!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  