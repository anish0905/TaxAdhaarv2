import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { generateFinalBill } from "@/app/actions/orderActions"; // Jo Server Action humne pehle banaya tha
import { redirect } from "next/navigation";
import { CheckCircle, ExternalLink, FileText } from "lucide-react";

export default async function ReviewOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean();

  if (!order) redirect("/dashboard/admin");

  // Client side form handling ke liye hum ek Client Component ka use kar sakte hain
  // Lekin yahan main logic samjha raha hoon
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: Documents List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
            <h2 className="text-2xl font-black italic uppercase mb-8 text-gray-900">Uploaded Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {order.documents.map((doc: any, i: number) => (
                <a 
                  key={i} 
                  href={doc.fileUrl} 
                  target="_blank" 
                  className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-500 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type: {doc.docType}</p>
                      <p className="text-xs font-black text-slate-900 uppercase truncate w-32">{doc.fileName}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-slate-300 group-hover:text-blue-600" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Generate Bill Form */}
        <div className="lg:col-span-1">
          <div className="bg-[#020617] text-white rounded-[3rem] p-10 shadow-2xl sticky top-24">
            <h3 className="text-xl font-black italic uppercase mb-8 text-blue-400">Generate Final Bill</h3>
            
            <form action={async (formData) => {
              "use server"
              const billData = {
                orderId: id,
                taxAmount: Number(formData.get("tax")),
                serviceCharge: Number(formData.get("service")),
                gstPercent: 18,
                remarks: String(formData.get("remarks"))
              };
              await generateFinalBill(billData);
              redirect("/admin/dashboard/admin");
            }} className="space-y-6">
              
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Government Tax (₹)</label>
                <input name="tax" type="number" defaultValue="500" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 font-black focus:border-blue-500 outline-none" required />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Professional Fee (₹)</label>
                <input name="service" type="number" defaultValue="1000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 font-black focus:border-blue-500 outline-none" required />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">CA Remarks</label>
                <textarea name="remarks" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-bold outline-none" placeholder="Everything looks good..." />
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20">
                Confirm & Send Bill
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}