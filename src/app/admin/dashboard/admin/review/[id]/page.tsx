import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { generateFinalBill } from "@/app/actions/orderActions";
import { redirect } from "next/navigation";
import { FileText, ExternalLink, User, Briefcase } from "lucide-react";

// ... (keep existing imports)

export default async function ReviewOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean();

  if (!order) redirect("/admin/dashboard");

  // Helper to make metadata keys look pretty (e.g., "biz_nature" -> "Biz Nature")
  const formatKey = (key: string) => key.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Service Header */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <User size={28} />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase italic tracking-tight text-slate-900">
                    {order.clientName}
                  </h1>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                    {order.serviceType}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                <p className="font-bold text-slate-900 text-xs">#{id.slice(-8)}</p>
              </div>
            </div>
            
            {/* DYNAMIC METADATA GRID */}
            {/* This section will now automatically show whatever data came with the service */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.metadata && Object.entries(order.metadata).map(([key, value]) => {
                // Skip internal fields if any
                if (key === 'clientName' || key === 'clientPhone') return null;
                
                return (
                  <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {formatKey(key)}
                    </p>
                    <p className="font-bold text-slate-800 text-sm italic">
                      {String(value) || "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents Grid */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
               <FileText size={20} className="text-blue-600" /> Documents Vault
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.documents.map((doc: any, i: number) => (
                <a key={i} href={doc.fileUrl} target="_blank" className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-500 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-50">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{doc.docType}</p>
                      <p className="text-xs font-bold text-slate-900 truncate w-40">{doc.fileName}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

       
        {/* RIGHT: Billing Form (Server Action) */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sticky top-24 shadow-2xl">
            <h3 className="text-xl font-black italic uppercase mb-6 text-blue-400">Final Assessment</h3>
            
            <form action={async (formData) => {
              "use server"
              const billData = {
                orderId: id,
                taxAmount: Number(formData.get("tax")),
                serviceCharge: Number(formData.get("service")),
                remarks: String(formData.get("remarks"))
              };
              await generateFinalBill(billData);
              redirect("/admin");
            }} className="space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Govt. Tax / Fees (₹)</label>
                <input name="tax" type="number" defaultValue="0" className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500 font-bold" />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">Our Professional Fee (₹)</label>
                <input name="service" type="number" defaultValue="1500" className="w-full bg-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-blue-500 font-bold" />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">CA Notes for Client</label>
                <textarea name="remarks" rows={3} className="w-full bg-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-blue-500" placeholder="Add any instructions..." />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest transition-all">
                Approve & Generate Bill
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}