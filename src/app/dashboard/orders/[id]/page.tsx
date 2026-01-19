// src/app/dashboard/orders/[id]/page.tsx
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { ExternalLink, ArrowLeft, CloudUpload } from "lucide-react";
import Link from "next/link";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id).lean();

  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard/orders" className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase mb-10">
          <ArrowLeft size={16} /> Back to Filings
        </Link>

        <div className="bg-white rounded-[3rem] p-10 shadow-xl mb-10">
          <h2 className="text-3xl font-black italic uppercase mb-8 text-gray-900">Uploaded Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {order.documents.map((doc: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.fileName}</p>
                  <p className="text-xs font-bold text-slate-900">Document Uploaded</p>
                </div>
                <a href={doc.fileUrl} target="_blank" className="p-3 bg-white rounded-xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all">
                  <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Naye Document Upload karne ke liye Option */}
        <div className="bg-[#020617] text-white rounded-[3rem] p-10 shadow-2xl">
          <h3 className="text-xl font-black italic uppercase mb-4 text-blue-400">Need to send more?</h3>
          <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-widest">You can upload additional images or missing files here.</p>
          
          {/* Yahan hum DocumentUploadZone component ko use kar sakte hain naye files ke liye */}
          <Link href={`/dashboard/process/${order.serviceType.toLowerCase()}`} className="inline-flex items-center gap-3 bg-blue-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
             <CloudUpload size={18} /> Upload More Documents
          </Link>
        </div>
      </div>
    </div>
  );
}