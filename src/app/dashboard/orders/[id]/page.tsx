import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  ExternalLink, ArrowLeft, CloudUpload, 
  CheckCircle2, Clock, AlertCircle, IndianRupee, 
  FileText, User, Calendar, MessageSquare, 
  LayoutGrid, History, ReceiptIndianRupee 
} from "lucide-react"; 
import Link from "next/link";
import { notFound } from "next/navigation";
import { RazorpayButton } from "../../components/payment/RazorpayButton";
import { ManualPayment } from "../../components/payment/ManualPayment";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean() as any;

  if (!order) return notFound();

  // Status Colors Logic
  const statusConfig: any = {
    under_review: { color: "text-blue-500", bg: "bg-blue-50", icon: <Clock size={20} />, label: "Under CA Review" },
    payment_pending: { color: "text-orange-500", bg: "bg-orange-50", icon: <IndianRupee size={20} />, label: "Awaiting Payment" },
    completed: { color: "text-emerald-500", bg: "bg-emerald-50", icon: <CheckCircle2 size={20} />, label: "Filing Completed" },
    rejected: { color: "text-rose-500", bg: "bg-rose-50", icon: <AlertCircle size={20} />, label: "Action Required" },
  };

  const currentStatus = statusConfig[order.status] || statusConfig.under_review;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <Link href="/dashboard/orders" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-10 hover:text-blue-600 transition-colors">
          <ArrowLeft size={16} /> Back to My Filings
        </Link>

        {/* 1. HERO HEADER */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentStatus.bg} ${currentStatus.color} font-black text-[10px] uppercase tracking-widest mb-6`}>
                {currentStatus.icon} {currentStatus.label}
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 leading-none mb-4">
                {order.serviceType.replace(/-/g, ' ')}
              </h1>
              <div className="flex flex-wrap gap-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-2"><User size={14} className="text-blue-600"/> {order.clientName}</span>
                <span className="flex items-center gap-2"><Calendar size={14} className="text-blue-600"/> {new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-2 text-slate-900 font-black italic">ID: #{order._id.toString().slice(-6).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Data & Documents */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SERVICE DATA (METADATA) */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <LayoutGrid className="text-blue-600" size={24} />
                <h2 className="text-2xl font-black italic uppercase text-slate-900">Application Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                {Object.entries(order.metadata || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="border-l-2 border-slate-100 pl-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm font-bold text-slate-800 uppercase italic">{value || "—"}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CA REMARKS */}
            {order.billing?.remarks && (
              <div className="bg-blue-50 rounded-[2.5rem] p-8 border border-blue-100 relative overflow-hidden">
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Message from Expert</h4>
                    <p className="text-sm font-bold text-slate-700 italic">"{order.billing.remarks}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* DOCUMENTS SECTION */}
            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black italic uppercase text-slate-900 mb-8">Uploaded Assets</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.documents.map((doc: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-500 transition-all">
                    <div className="overflow-hidden">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{doc.docType}</p>
                      <p className="text-xs font-bold text-slate-900 truncate pr-2">{doc.fileName}</p>
                    </div>
                    <a href={doc.fileUrl} target="_blank" className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                      <ExternalLink size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Billing & Timeline */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* BILLING SUMMARY CARD */}
            <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                  <ReceiptIndianRupee size={18} /> Final Invoice
                </h3>
              </div>
              
              <div className="space-y-4 mb-10 border-b border-white/10 pb-8">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Professional Fee</span>
                  <span className="text-white">₹{order.billing?.serviceCharge || 0}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Govt. / Official Fees</span>
                  <span className="text-white">₹{order.billing?.taxAmount || 0}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>GST (18%)</span>
                  <span className="text-white">₹{order.billing?.gstAmount || 0}</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-xs font-black uppercase text-blue-400 italic">Total Amount</span>
                  <h4 className="text-4xl font-black italic tracking-tighter">
                    ₹{order.billing?.totalAmount?.toLocaleString('en-IN') || 0}
                  </h4>
                </div>
              </div>

              {order.paymentStatus !== 'paid' ? (
                <div className="space-y-4">
                  <RazorpayButton amount={order.billing.totalAmount} orderId={order._id.toString()} />
                  
                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                    <span className="relative bg-slate-900 px-4 text-[9px] font-black text-slate-500 uppercase">OR</span>
                  </div>

                  <ManualPayment orderId={order._id.toString()} amount={order.billing.totalAmount} />
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="text-emerald-500" />
                  <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Payment Received</p>
                </div>
              )}
            </div>

            {/* FILING JOURNEY TIMELINE */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <History size={14} className="text-blue-600" /> Filing Journey
              </p>
              <div className="space-y-6">
                <TimelineStep label="Application Filed" date={order.createdAt} completed={true} />
                <TimelineStep label="Expert Assessment" date={order.updatedAt} completed={order.status !== 'pending'} />
                <TimelineStep label="Payment & Verification" date={order.billing?.paymentDate} completed={order.paymentStatus === 'paid'} />
                <TimelineStep label="Process Completed" date={null} completed={order.status === 'completed'} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Timeline (Same as before but cleaned up)
function TimelineStep({ label, date, completed }: { label: string, date?: any, completed: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-sm ${completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
          {completed ? <CheckCircle2 size={10} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
        </div>
        <div className={`w-[2px] h-10 my-1 ${completed ? 'bg-emerald-100' : 'bg-slate-50'}`}></div>
      </div>
      <div className="pt-0.5">
        <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${completed ? 'text-slate-900' : 'text-slate-300'}`}>{label}</p>
        {date && <p className="text-[8px] font-bold text-slate-400 mt-1.5 uppercase italic">{new Date(date).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}