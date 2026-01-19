import { getClientDetails } from "@/app/actions/adminActions";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  MessageCircle, 
  Briefcase, 
  Clock, 
  IndianRupee,
  ExternalLink 
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Next.js 15: await params zaroori hai
  const { id } = await params;
  const res = await getClientDetails(id);

  if (!res.success) return notFound();

  const { client, orders } = res;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <Link href="/admin/dashboard/admin/clients" className="inline-flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-blue-600 transition-colors">
          <ArrowLeft size={14} /> Back to Directory
        </Link>

        {/* Profile Header Card */}
        <div className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="flex items-center gap-8">
              <div className="w-28 h-28 bg-[#020617] text-white rounded-[2.5rem] flex items-center justify-center text-5xl font-black italic shadow-2xl">
                {client.name?.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900">{client.name}</h1>
                  {client.isVerified && <ShieldCheck className="text-emerald-500" size={24} />}
                </div>
                <div className="flex flex-wrap gap-4">
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
                    <Mail size={14} className="text-blue-500" /> {client.email}
                  </span>
                  <span className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
                    <Phone size={14} className="text-blue-500" /> {client.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Support Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <a href={`https://wa.me/91${client.phone}`} target="_blank" className="flex-1 md:flex-none bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200">
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a href={`tel:${client.phone}`} className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                <Phone size={16} /> Call
              </a>
            </div>
          </div>
        </div>

        {/* Stats & History Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left: Summary Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Client Summary</h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-blue-600" size={18} />
                      <span className="text-[10px] font-black uppercase text-slate-600">Total Filings</span>
                    </div>
                    <span className="text-xl font-black italic">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-blue-600" size={18} />
                      <span className="text-[10px] font-black uppercase text-slate-600">Member Since</span>
                    </div>
                    <span className="text-[11px] font-bold">{new Date(client.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Right: Detailed Order History */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 flex items-center gap-3">
              Filing History <div className="h-[2px] flex-1 bg-slate-100"></div>
            </h3>

            {orders.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-wrap justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-black italic">
                        {order.serviceType.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{order.serviceType}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          <span className="flex items-center gap-1"><Clock size={10}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-blue-500 font-black">#{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Bill</p>
                        <p className="text-sm font-black italic flex items-center justify-end">
                          <IndianRupee size={12}/> {order.billing?.totalAmount || 0}
                        </p>
                      </div>
                      <Link href={`/dashboard/admin/review/${order._id}`} className="bg-slate-50 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-slate-400">
                         <ExternalLink size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No orders found</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}