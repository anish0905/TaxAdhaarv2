"use client";
import React, { useState } from 'react';
import { 
  LifeBuoy, 
  MessageCircle, 
  Mail, 
  Phone, 
  Send, 
  ChevronRight, 
  FileQuestion,
  Loader2,
  CheckCircle
} from "lucide-react";

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // API Call Logic Here
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-4 md:p-0 pb-20 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Help <span className="text-blue-600">Center</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] mt-4 flex items-center gap-2">
            <LifeBuoy size={16} className="text-blue-600" />
            We're here to assist you with your filings
          </p>
        </div>
      </div>

      {/* QUICK CONTACT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ContactCard 
          icon={<MessageCircle className="text-emerald-500" />} 
          title="WhatsApp Support" 
          detail="Instant Chat" 
          action="Chat Now" 
          color="emerald"
        />
        <ContactCard 
          icon={<Mail className="text-blue-500" />} 
          title="Email Query" 
          detail="support@portal.com" 
          action="Write Email" 
          color="blue"
        />
        <ContactCard 
          icon={<Phone className="text-indigo-500" />} 
          title="Call Expert" 
          detail="+91 98765 43210" 
          action="Call Now" 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* SUPPORT TICKET FORM */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Raise a Ticket</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Expected response time: 2-4 hours</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-8 md:p-12 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Category</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                  <option>Payment Issue</option>
                  <option>Document Upload Error</option>
                  <option>Service Delay</option>
                  <option>General Query</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Message</label>
                <textarea 
                  rows={5}
                  placeholder="Describe your problem in detail..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all resize-none"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading || submitted}
                className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl
                  ${submitted ? "bg-emerald-500 text-white" : "bg-[#020617] text-white hover:bg-blue-600 active:scale-95"}
                `}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : submitted ? <CheckCircle size={20} /> : <Send size={20} />}
                {loading ? "Sending..." : submitted ? "Ticket Raised Successfully" : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#020617] p-8 md:p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-lg font-black italic uppercase tracking-tighter mb-6 flex items-center gap-2">
                  <FileQuestion size={20} className="text-blue-500" /> FAQ Quick Links
                </h3>
                <div className="space-y-4">
                  <FAQLink title="How to track my application?" />
                  <FAQLink title="Refund policy for failed payments" />
                  <FAQLink title="Document verification time" />
                  <FAQLink title="Adding multiple GST numbers" />
                </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Office Hours</p>
             <h4 className="text-lg font-black italic">Mon - Sat: 10 AM - 7 PM</h4>
             <p className="text-[9px] font-bold mt-4 leading-relaxed opacity-70 italic">
               *Emails sent outside office hours will be addressed on the next business day.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper Components
function ContactCard({ icon, title, detail, action, color }: any) {
  const colors: any = {
    emerald: "hover:border-emerald-200 hover:bg-emerald-50/30",
    blue: "hover:border-blue-200 hover:bg-blue-50/30",
    indigo: "hover:border-indigo-200 hover:bg-indigo-50/30",
  };
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-300 group ${colors[color]}`}>
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-sm font-black text-slate-900 mt-1 mb-4">{detail}</h3>
      <button className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 text-slate-500 group-hover:text-blue-600 transition-colors">
        {action} <ChevronRight size={14} />
      </button>
    </div>
  );
}

function FAQLink({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all group">
      <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{title}</span>
      <ChevronRight size={14} className="text-slate-500" />
    </div>
  );
}