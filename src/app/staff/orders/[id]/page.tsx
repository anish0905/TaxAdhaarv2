import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  FileText, User, Phone, Download, 
  Briefcase, ArrowLeft,
  AlertCircle, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompleteOrderButton from "../../components/CompleteOrderButton";

// Next.js 15 dynamic params handling
export default async function StaffOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  
  // 1. Params ko unwrap karein
  const { id } = await params;

  await connectDB();
  
  // 2. Database se client data fetch karein
  const order = await Order.findById(id).lean();

  if (!order) return notFound();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-6">
      <div className="max-w-6xl mx-auto px-4 lg:px-0">
        
        {/* TOP NAVIGATION BAR */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link 
            href="/staff/dashboard" 
            className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100"
          >
            <ArrowLeft size={14} /> Back to My Queue
          </Link>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-100/50">
            <ShieldCheck size={14} className="animate-pulse" /> Payment Verified & Paid
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: CLIENT IDENTITY & DOCUMENTS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Client Profile Header */}
            <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl italic shadow-xl">
                      {order.clientName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Processing Active Client</p>
                      <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter">
                        {order.clientName}
                      </h1>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-6">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                       <Briefcase size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-slate-700 uppercase">{order.serviceType}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                       <Phone size={14} className="text-blue-500" />
                       <span className="text-[10px] font-black text-slate-700">{order.clientPhone}</span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Client Submitted Documents */}
            <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <FileText className="text-blue-600" size={18} /> Client Documents
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Review files for filing compliance</p>
                </div>
                <span className="bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black text-slate-600 uppercase border border-slate-200">
                  {order.documents?.length || 0} Total Files
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {order.documents && order.documents.length > 0 ? (
                  order.documents.map((doc: any) => (
                    <div 
                      key={doc._id?.toString() || doc.fileUrl} 
                      className="group p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-400 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-md group-hover:bg-blue-600 group-hover:text-white transition-all border border-slate-50">
                          <FileText size={20} />
                        </div>
                        <a 
                          href={doc.fileUrl} 
                          target="_blank" 
                          className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-xl shadow-sm border border-slate-100 transition-all hover:rotate-12 active:scale-90"
                          title="Open/Download File"
                        >
                          <Download size={18} />
                        </a>
                      </div>
                      <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-none mb-1 group-hover:text-blue-600 transition-colors">
                        {doc.docType}
                      </p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase truncate">
                        {doc.fileName}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <AlertCircle className="mx-auto text-slate-300 mb-4" size={40} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      No documents found for this client
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SECTION: TASK MANAGEMENT */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#020617] rounded-[3.5rem] p-8 md:p-10 text-white shadow-2xl lg:sticky lg:top-24 border border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-10 text-center">Processing Actions</h3>
              
              <div className="space-y-8">
                {/* Status Indicator */}
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 shadow-inner">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Workflow Status</p>
                  <p className="text-sm font-black italic uppercase text-emerald-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Paid & Ready to File
                  </p>
                </div>

                {/* Main Action Area */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Update Filing Progress</p>
                  
                  {/* Interactive Button Component */}
                  <CompleteOrderButton 
                    orderId={id} 
                    currentStatus={order.status} 
                  />

                  <button className="w-full bg-white/5 hover:bg-white/10 text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all border border-white/10 flex items-center justify-center gap-2">
                    <AlertCircle size={16} /> Report Missing Info
                  </button>
                </div>

                {/* Help Box */}
                <div className="mt-8 p-6 bg-blue-900/20 rounded-3xl border border-blue-500/20">
                  <p className="text-[9px] font-bold text-blue-300 leading-relaxed uppercase italic">
                    Note: Clicking "Mark as Completed" will notify the client and move this to your history.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}