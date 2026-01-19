import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  TrendingUp, 
  BarChart3, 
  PhoneCall 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await connectDB();
  
  // Stats fetch karna
  const totalLeads = await Order.countDocuments();
  const pendingPayments = await Order.countDocuments({ 
    paymentStatus: { $ne: 'paid' }, 
    status: 'payment_pending' 
  });
  const completedTasks = await Order.countDocuments({ status: 'completed' });

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: <Users className="text-blue-600" size={24} />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      desc: "All time registrations"
    },
    {
      label: "Awaiting Payments",
      value: pendingPayments,
      icon: <IndianRupee className="text-orange-500" size={24} />,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-500",
      desc: "Verified & bill generated"
    },
    {
      label: "Completed Filings",
      value: completedTasks,
      icon: <CheckCircle2 className="text-emerald-500" size={24} />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-500",
      desc: "Successfully processed"
    }
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">
          Business <span className="text-blue-600">Overview</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
          Real-time platform performance metrics
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white p-8 rounded-[2.5rem] shadow-sm border-b-4 ${stat.borderColor} transition-all hover:shadow-xl hover:-translate-y-1`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 ${stat.bgColor} rounded-2xl`}>
                {stat.icon}
              </div>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 italic">{stat.value}</h3>
              <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area: Activity & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Activity Card */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                <PhoneCall size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase italic">Call Center Activity</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Performance Tracking</p>
              </div>
            </div>
            
            {/* Placeholder for chart/list */}
            <div className="h-48 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
               <BarChart3 size={32} className="text-slate-200 mb-2" />
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
                 Sales Analytics Coming Soon
               </p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16"></div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-[#020617] p-8 md:p-10 rounded-[3rem] text-white shadow-2xl">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8">System Health</h3>
           <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs font-bold uppercase opacity-80">Database Connected</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs font-bold uppercase opacity-80">Payment Gateway Active</p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/10">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-4">Quick Links</p>
                <button className="w-full bg-white/10 hover:bg-blue-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Generate Report
                </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}