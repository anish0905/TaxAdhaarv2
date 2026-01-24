import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  FileText, User, Phone, Download, 
  Briefcase, ArrowLeft, AlertCircle, 
  ShieldCheck, CloudUpload, LayoutGrid,
  History, Info
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CompleteOrderButton from "../../components/CompleteOrderButton";
import StaffFileUpload from "../../components/StaffFileUpload";

export default async function StaffOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  
  // Fetch data and ensure it's plain JSON for Client Components
  const orderRaw = await Order.findById(id).lean();
  if (!orderRaw) return notFound();
  
  const order = JSON.parse(JSON.stringify(orderRaw));

  // Helper for Status UI
  const isCompleted = order.status === 'completed';
  const statusColor = isCompleted ? 'text-emerald-400' : 'text-blue-400';

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- TOP NAVIGATION --- */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link 
            href="/staff/dashboard" 
            className="group flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Queue
          </Link>
          
          <div className={`flex items-center gap-2 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm transition-colors ${
            isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
          }`}>
            <ShieldCheck size={14} className={isCompleted ? "" : "animate-pulse"} /> 
            {isCompleted ? "Filing Successfully Completed" : "Payment Verified & Processing"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT COLUMN: CORE DATA --- */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 1. Client Identity Card */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl italic shadow-2xl rotate-3">
                      {order.clientName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Assigned Client</p>
                      <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        {order.clientName}
                      </h1>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Service Type</p>
                      <p className="text-[11px] font-black text-slate-800 uppercase flex items-center gap-2 italic">
                        <Briefcase size={14} className="text-blue-600"/> {order.serviceType}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Primary Contact</p>
                      <p className="text-[11px] font-black text-slate-800 flex items-center gap-2 italic">
                        <Phone size={14} className="text-blue-600"/> {order.clientPhone}
                      </p>
                    </div>
                    <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Filing Reference</p>
                      <p className="text-[11px] font-black text-slate-800 uppercase italic">
                        #{String(order._id).slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
               </div>
            </div>

          
            {/* Client Original Assets List */}
            <div className="bg-white rounded-[3.5rem] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <FileText className="text-blue-600" size={16} /> User Assets
                </h3>
                <span className="text-[8px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">
                  {order.documents?.filter((d:any) => d.uploadedBy === 'client').length || 0} FILES
                </span>
              </div>
              
              <div className="space-y-3">
                {order.documents?.filter((d:any) => d.uploadedBy === 'client').map((doc: any) => (
                  <div key={doc.fileUrl} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 group hover:border-blue-400 hover:bg-white transition-all">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-900 uppercase truncate mb-0.5">{doc.docType}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase truncate">Source Document</p>
                    </div>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      className="p-3 bg-white rounded-xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all transform group-hover:rotate-12"
                      title="Download Asset"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Dynamic Form Data (Metadata) */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 mb-10 flex items-center gap-3">
                 <LayoutGrid size={26} className="text-blue-600" /> Form Submission Details
               </h3>
               
               {order.metadata && Object.keys(order.metadata).length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {Object.entries(order.metadata).map(([key, val]: any) => (
                     <div key={key} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-lg transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-600 transition-colors">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs font-bold text-slate-800 italic uppercase">
                          {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                        </p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No additional form data provided</p>
                 </div>
               )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: ACTIONS & ASSETS --- */}
          <div className="lg:col-span-4 space-y-8">
              {/* 2. Upload Proof Section (The Staff's Main Task) */}
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border-2 border-blue-50 relative overflow-hidden">
               <div className="absolute -right-4 top-10 opacity-5 -rotate-12">
                  <CloudUpload size={160} />
               </div>
               <div className="relative z-10">
                  <div className="mb-10">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 flex items-center gap-3">
                      <CloudUpload size={28} className="text-blue-600" /> Share Filing Proof
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest italic flex items-center gap-2">
                      <Info size={12} /> Upload the Govt Acknowledgement Slip or Certificate below
                    </p>
                  </div>

                  <StaffFileUpload orderId={id} existingDocs={order.documents} />
               </div>
            </div>
            
            {/* Filing Control Center */}
            <div className="bg-[#020617] rounded-[3.5rem] p-10 text-white shadow-2xl sticky top-6 border border-white/5">
              <div className="w-12 h-1 bg-blue-600 mx-auto mb-8 rounded-full opacity-50"></div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-12 text-center">Filing Control Panel</h3>
              
              <div className="space-y-8">
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center backdrop-blur-sm">
                  <p className="text-[9px] font-bold text-slate-500 uppercase mb-3 tracking-[0.2em]">Current Workflow Stage</p>
                  <p className={`text-sm font-black italic uppercase flex items-center justify-center gap-2 ${statusColor}`}>
                    <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
                    {order.status.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="space-y-4">
                  <CompleteOrderButton 
                    orderId={id} 
                    currentStatus={order.status} 
                  />
                  
                  <button className="w-full bg-white/5 hover:bg-rose-600/10 hover:text-rose-400 hover:border-rose-600/20 text-white py-6 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest border border-white/10 flex items-center justify-center gap-2 transition-all">
                    <AlertCircle size={14} /> Mark as Discrepancy
                  </button>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                   <p className="text-[8px] font-bold text-slate-500 text-center uppercase leading-relaxed italic">
                     Closing this order will notify the client and <br/> lock the document editing.
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