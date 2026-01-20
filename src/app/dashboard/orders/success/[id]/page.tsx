import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  CheckCircle2, FileText, User, Briefcase, 
  ArrowLeft, ShieldCheck, CreditCard, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "../../components/PrintButton"; // Import karein

export default async function OrderSuccessDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  const order = await Order.findById(id).lean() as any;

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/dashboard/orders" className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            <ArrowLeft size={14} /> Back to My Applications
          </Link>
          <div className="flex gap-3">
             <PrintButton /> {/* Client Component Yahan use karein */}
          </div>
        </div>

        {/* --- Baki poora code same rahega --- */}
        {/* Header Section */}
        <div className="bg-[#020617] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-14 mb-10 relative overflow-hidden shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -mr-40 -mt-40"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 shrink-0">
              <CheckCircle2 size={48} />
            </div>
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                 <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
                    Confirmed
                 </h1>
                 <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mx-auto md:mx-0">
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                 </span>
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em]">
                Ref: #{String(order._id).slice(-12).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Clients & Invoice Grid (Wahi logic jo pehle tha) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ... Client Info and Financials ... */}
            {/* Same as your previous code snippet */}
        </div>

      </div>
      
      {/* Footer Branding for Print */}
      <div className="hidden print:block mt-20 border-t pt-8 text-center">
         <p className="text-sm font-black uppercase italic tracking-tighter">Legal Filing Service Portal</p>
         <p className="text-[10px] text-slate-400 mt-1">This is a system generated receipt and does not require a physical signature.</p>
      </div>
    </div>
  );
}