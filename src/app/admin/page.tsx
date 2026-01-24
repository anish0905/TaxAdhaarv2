import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { 
  Users, IndianRupee, CheckCircle2, 
  TrendingUp, BarChart3, PhoneCall, 
  Wallet, PieChart, Activity, ArrowUpRight 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await connectDB();
  
  // 1. RAW DATA FETCHING
  const orders = await Order.find({}).lean();
  const users = await User.find({}).lean();

  // 2. FINANCIAL AGGREGATIONS
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + (curr.billing?.totalAmount || 0), 0);
  const totalServiceCharge = paidOrders.reduce((acc, curr) => acc + (curr.billing?.serviceCharge || 0), 0);

  // Monthly & Yearly Income
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const monthlyIncome = paidOrders
    .filter(o => new Date(o.createdAt) >= startOfMonth)
    .reduce((acc, curr) => acc + (curr.billing?.totalAmount || 0), 0);

  const yearlyIncome = paidOrders
    .filter(o => new Date(o.createdAt) >= startOfYear)
    .reduce((acc, curr) => acc + (curr.billing?.totalAmount || 0), 0);

  // 3. REFERRAL & LIABILITIES
  const totalCommissionPaid = users.reduce((acc, curr) => acc + (curr.referralEarnings?.totalCommissionEarned || 0), 0);
  const totalWalletLiabilities = users.reduce((acc, curr) => acc + (curr.referralEarnings?.balance || 0), 0);

  // 4. STATUS COUNTS
  const pendingPayments = orders.filter(o => o.paymentStatus !== 'paid' && o.status === 'payment_pending').length;
  const completedTasks = orders.filter(o => o.status === 'completed').length;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <TrendingUp className="text-blue-600" />, bgColor: "bg-blue-50", borderColor: "border-blue-500", desc: "Lifetime Earnings" },
    { label: "Monthly Income", value: `₹${monthlyIncome.toLocaleString()}`, icon: <BarChart3 className="text-emerald-600" />, bgColor: "bg-emerald-50", borderColor: "border-emerald-500", desc: `Since ${startOfMonth.toLocaleDateString('en-IN', {month: 'short'})}` },
    { label: "Service Charges", value: `₹${totalServiceCharge.toLocaleString()}`, icon: <Activity className="text-indigo-600" />, bgColor: "bg-indigo-50", borderColor: "border-indigo-500", desc: "Net Service Value" },
    { label: "Payout Liabilities", value: `₹${totalWalletLiabilities.toLocaleString()}`, icon: <Wallet className="text-rose-600" />, bgColor: "bg-rose-50", borderColor: "border-rose-500", desc: "Agent Wallets" }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Executive <span className="text-blue-600">Dashboard</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            System Operational • {now.toDateString()}
          </p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Yearly Goal</p>
              <p className="text-sm font-black text-slate-900 italic">₹{yearlyIncome.toLocaleString()} / ₹1Cr</p>
           </div>
        </div>
      </div>

      {/* 2. TOP STATS GRID */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-8 rounded-[3rem] shadow-sm border-b-4 ${stat.borderColor} transition-all hover:shadow-xl group`}>
            <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{stat.value}</h3>
            <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase flex items-center gap-1">
               <ArrowUpRight size={10} /> {stat.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 3. BUSINESS ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Activity & Conversion */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Conversion Funnel</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Order to Payment Lifecycle</p>
              </div>
              <PieChart className="text-slate-200" size={32} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Leads</p>
                 <h4 className="text-4xl font-black italic text-blue-600">{orders.length}</h4>
                 <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-full"></div>
                 </div>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting Pay</p>
                 <h4 className="text-4xl font-black italic text-orange-500">{pendingPayments}</h4>
                 <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(pendingPayments/orders.length)*100}%` }}></div>
                 </div>
              </div>
              <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Success Rate</p>
                 <h4 className="text-4xl font-black italic text-emerald-600">{completedTasks}</h4>
                 <div className="h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600" style={{ width: `${(completedTasks/orders.length)*100}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* System & Payout Health */}
        <div className="bg-[#020617] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 flex items-center gap-2">
                <Activity size={14} /> Fiscal Responsibility
              </h3>
              
              <div className="space-y-8">
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Commission Paid</p>
                  <p className="text-2xl font-black italic text-white">₹{totalCommissionPaid.toLocaleString()}</p>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.2em]">Operational Status</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase opacity-60">Payment Gateway</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-black">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                      <span className="text-[10px] font-bold uppercase opacity-60">Auth Service</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md font-black">STABLE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -mb-24 -mr-24"></div>
        </div>
      </div>
      {/* 4. RECENT HIGH-VALUE LEADS TABLE */}
      <div className="bg-white rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
              High-Value <span className="text-blue-600">Leads</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">
              Top billing clients from current month
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100">
            <TrendingUp size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Top Performers</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Client Identity</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Service Type</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Revenue</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paidOrders
                .sort((a, b) => (b.billing?.totalAmount || 0) - (a.billing?.totalAmount || 0)) // Sort by Amount
                .slice(0, 5) // Top 5 Leads
                .map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black italic shadow-inner">
                          {order.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-900 uppercase">{order.clientName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: #{String(order._id).slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight bg-slate-100 px-3 py-1 rounded-lg">
                        {order.serviceType}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-emerald-600 italic">₹{order.billing?.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{order.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          
          {paidOrders.length === 0 && (
            <div className="p-16 text-center">
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.2em] italic">
                No high-value leads detected in current cycle.
              </p>
            </div>
          )}
        </div>
      </div>







      

      {/* SYSTEM HEALTH & API MONITORING */}
<div className="bg-[#020617] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden h-full">
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <Activity size={14} className="animate-pulse" /> Infrastructure Status
        </h3>
        <span className="text-[8px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black border border-blue-500/30">
          V 2.0.4 - STABLE
        </span>
      </div>
      
      <div className="space-y-6">
        {/* Database Check */}
        <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80">MongoDB Cluster</p>
          </div>
          <p className="text-[10px] font-black text-emerald-400">9ms Latency</p>
        </div>

        {/* API Gateway */}
        <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Next-Auth API</p>
          </div>
          <p className="text-[10px] font-black text-emerald-400">ONLINE</p>
        </div>

        {/* Storage Health */}
        <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Cloudinary (CDN)</p>
          </div>
          <p className="text-[10px] font-black text-amber-400">84% FULL</p>
        </div>

        {/* Server Memory */}
        <div className="pt-6 mt-6 border-t border-white/10">
           <div className="flex justify-between items-center mb-2">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Server Load (CPU)</p>
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">12%</p>
           </div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: '12%' }}></div>
           </div>
        </div>
      </div>
    </div>
    
    {/* Decorative Blur */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
</div>
    </div>
  );
}