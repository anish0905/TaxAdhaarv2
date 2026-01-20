import React from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  Download, 
  Search, 
  Filter, 
  Wallet, 
  History,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

export default function PaymentsPage() {
  // Mock Payments Data
  const transactions = [
    { id: "TXN1024", service: "ITR Filing - FY 2023-24", amount: "₹2,499", date: "15 Jan 2024", status: "completed", method: "UPI" },
    { id: "TXN1025", service: "GST Registration", amount: "₹4,999", date: "18 Jan 2024", status: "pending", method: "Net Banking" },
    { id: "TXN1026", service: "TDS Consultation", amount: "₹999", date: "10 Jan 2024", status: "failed", method: "Card" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Billing <span className="text-blue-600">& Ledger</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
            <Wallet size={14} className="text-blue-600" />
            Manage your invoices and payment activities
          </p>
        </div>

        <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#020617] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
          <CreditCard size={18} /> Make New Payment
        </button>
      </div>

      {/* QUICK STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Outstanding</p>
                <h2 className="text-4xl font-black italic mt-2">₹4,999</h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full">
                    <AlertCircle size={12} /> Due in 3 days
                </div>
            </div>
            <ArrowUpRight className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity" size={40} />
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Paid</p>
            <h2 className="text-4xl font-black italic text-slate-900 mt-2">₹12,450</h2>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <CheckCircle2 size={12} /> 6 Successful Payments
            </div>
        </div>

        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm transition-all">
                <Download size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Download Statement</p>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                <History size={20} />
             </div>
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Payment History</h3>
          </div>
          
          <div className="relative w-full md:w-64">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
             <input type="text" placeholder="Search ID..." className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Service / Plan</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6 text-xs font-black text-slate-400">#{txn.id}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-slate-900 leading-none">{txn.service}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase">{txn.date} via {txn.method}</p>
                  </td>
                  <td className="px-8 py-6 text-sm font-black text-slate-900">{txn.amount}</td>
                  <td className="px-8 py-6">
                    <PaymentStatus status={txn.status} />
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-slate-900 transition-colors">
                      <Download size={14} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Status Badge Component
function PaymentStatus({ status }: { status: string }) {
  const styles: any = {
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    failed: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${styles[status]}`}>
      {status}
    </span>
  );
}