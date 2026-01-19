import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  CheckCircle2, FileText, Download, 
  ExternalLink, User, Phone, Briefcase, 
  ArrowLeft, Printer, ShieldCheck, CreditCard
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderSuccessDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  const order = await Order.findById(id).lean();

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation - Hidden on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link href="/dashboard/client/orders" className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all">
            <ArrowLeft size={14} /> Back to My Applications
          </Link>
          <div className="flex gap-3">
             <button 
               onClick={() => window.print()} 
               className="bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
             >
               <Printer size={16} /> Print Receipt
             </button>
          </div>
        </div>

        {/* Header Section / Success Banner */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Client & Documents */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Client Card */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm relative">
              <div className="flex items-center gap-3 mb-10">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><User size={20}/></div>
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Applicant Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Legal Name</label>
                  <p className="text-2xl font-black text-slate-900 uppercase italic leading-none">{order.clientName}</p>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Contact Info</label>
                  <p className="text-lg font-bold text-slate-700 leading-none">{order.clientPhone}</p>
                </div>
                <div className="md:col-span-2 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-3">Selected Service</label>
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-blue-500" />
                    <span className="text-sm font-black text-blue-700 uppercase italic">
                      {order.serviceType.replace(/-/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Documents Grid */}
            <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-50 text-slate-900 rounded-2xl"><FileText size={20}/></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Submitted Files</h3>
                 </div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.documents?.length} Total</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {order.documents?.map((doc: any, index: number) => (
                  <a 
                    key={index}
                    href={doc.fileUrl} 
                    target="_blank"
                    className="group flex items-center justify-between p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:border-blue-400 hover:bg-white transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-100">
                        <FileText size={18} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-slate-900 uppercase truncate mb-0.5">{doc.docType}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{doc.fileName}</p>
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-slate-300 group-hover:text-blue-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Financials & Steps */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-24">
              <div className="flex items-center gap-3 mb-10">
                 <CreditCard size={18} className="text-blue-600" />
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Tax Invoice</h3>
              </div>
              
              <div className="space-y-5">
                <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-500">
                  <span>Professional Fee</span>
                  <span className="font-black text-slate-900 italic">₹{order.billing?.serviceCharge}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-500">
                  <span>Govt Taxes</span>
                  <span className="font-black text-slate-900 italic">₹{order.billing?.taxAmount}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold uppercase text-slate-500 pb-6 border-b border-dashed border-slate-200">
                  <span>GST (18%)</span>
                  <span className="font-black text-slate-900 italic">₹{order.billing?.gstAmount}</span>
                </div>
                
                <div className="pt-2">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 text-center md:text-left">Net Amount Paid</p>
                  <p className="text-5xl font-black text-slate-900 italic tracking-tighter text-center md:text-left">₹{order.billing?.totalAmount}</p>
                </div>

                <div className="pt-10">
                  <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-blue-100">
                    <ShieldCheck size={60} className="absolute -right-4 -bottom-4 opacity-10" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-4">Official Status</p>
                    <p className="text-xs font-bold leading-relaxed italic uppercase">
                      Payment Received. Our experts are filing your {order.serviceType.replace(/-/g, " ")} application. Check your email for updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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