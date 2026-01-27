import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { CheckCircle, XCircle, ExternalLink, IndianRupee, User, Calendar, AlertCircle } from "lucide-react";
import { verifyPaymentAction, rejectPaymentAction } from "@/app/actions/paymentActions";
export const dynamic = 'force-dynamic';

export default async function AdminPaymentVerification() {
  await connectDB();
  
  const pendingOrders = await Order.find({ 
    paymentStatus: "verification_pending" 
  }).sort({ updatedAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
            Payment <span className="text-blue-600">Requests</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2">
            Verify manual bank transfers & QR payments
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {pendingOrders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100 flex flex-col lg:flex-row gap-10 items-center animate-in fade-in slide-in-from-bottom-4">
              
              {/* LEFT: Screenshot Preview */}
              <div className="w-full lg:w-64 h-80 bg-slate-100 rounded-[2rem] overflow-hidden relative group border-4 border-slate-50 shadow-inner">
                {order.manualPaymentScreenshot ? (
                  <>
                    <img 
                      src={order.manualPaymentScreenshot} 
                      alt="Payment Proof" 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                    />
                    <a 
                      href={order.manualPaymentScreenshot} 
                      target="_blank" 
                      className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-all backdrop-blur-sm"
                    >
                      <ExternalLink size={24} />
                      <span className="ml-2 font-black text-[10px] uppercase">View Full Proof</span>
                    </a>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 uppercase font-black text-[10px]">
                    No Image Found
                  </div>
                )}
              </div>

              {/* CENTER: Details */}
              <div className="flex-1 space-y-6 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                      {order.serviceType}
                    </span>
                    <h3 className="text-2xl font-black uppercase italic text-slate-900 mt-2 leading-none">
                      {order.clientName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                    <p className="text-2xl font-black text-blue-600 italic">₹{order.billing?.totalAmount?.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase">Date</p>
                         <p className="text-[10px] font-bold text-slate-700">{new Date(order.updatedAt).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase">ID</p>
                         <p className="text-[10px] font-bold text-slate-700 uppercase">#{order._id.toString().slice(-8)}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* RIGHT: Actions */}
              <div className="w-full lg:w-auto flex flex-col gap-3">
                
                {/* APPROVE FORM */}
                <form action={async (formData) => {
                  "use server";
                  await verifyPaymentAction(formData);
                }}>
                  <input type="hidden" name="orderId" value={order._id.toString()} />
                  <button 
                    type="submit" 
                    className="w-full lg:w-48 bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                </form>

                {/* REJECT FORM */}
                <form action={async (formData) => {
                  "use server";
                  await rejectPaymentAction(formData);
                }}>
                  <input type="hidden" name="orderId" value={order._id.toString()} />
                  {/* Default rejection reason, can be improved with a client-side prompt if needed */}
                  <input type="hidden" name="reason" value="The payment screenshot is unclear or invalid. Please upload again." />
                  <button 
                    type="submit" 
                    className="w-full lg:w-48 bg-white border border-rose-100 text-rose-500 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <XCircle size={16} /> Reject Proof
                  </button>
                </form>

              </div>
            </div>
          ))}

          {pendingOrders.length === 0 && (
            <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
              <p className="text-slate-300 font-black uppercase text-sm tracking-widest italic">
                No pending payments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}