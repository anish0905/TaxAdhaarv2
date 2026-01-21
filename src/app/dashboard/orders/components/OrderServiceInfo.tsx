import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function OrderServiceInfo({ order }: { order: any }) {
  return (
    <div className="xl:w-1/4 p-8 bg-slate-50/50 rounded-[3rem] flex flex-col justify-between border border-slate-50">
      <div className="space-y-6">
        <div className="w-14 h-14 bg-[#020617] text-blue-500 rounded-2xl flex items-center justify-center text-xl font-black italic shadow-lg">
          {order.serviceType.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">ID: #{String(order._id).slice(-6).toUpperCase()}</p>
          <h2 className="text-xl font-black text-slate-900 uppercase leading-tight tracking-tight">
            {order.serviceType.replace(/-/g, " ")}
          </h2>
        </div>
        <Link href={`/dashboard/client/orders/${order._id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-colors">
          View Dossier <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}