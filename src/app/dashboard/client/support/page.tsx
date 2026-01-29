"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, MessageCircle, Mail, Phone, Send, 
  ChevronRight, FileQuestion, Loader2, CheckCircle,
  LucideIcon 
} from "lucide-react";

// --- INTERFACES ---
interface ContactCardProps {
  Icon: LucideIcon; // Component pass karenge, element nahi
  title: string;
  detail: string;
  color: 'emerald' | 'blue' | 'indigo';
  link: string;
}

interface FAQLinkProps {
  title: string;
}

// --- ANIMATIONS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTicketSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-8 md:space-y-12 font-sans selection:bg-blue-100"
    >
      {/* HEADER */}
      <motion.div variants={itemVariants} className="text-center lg:text-left">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.9]">
          Help <span className="text-blue-600">Center</span>
        </h1>
        <div className="flex items-center justify-center lg:justify-start gap-2 mt-6">
           <LifeBuoy size={18} className="text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
           <p className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em]">
             TaxAadhaar Digital Solutions Support
           </p>
        </div>
      </motion.div>

      {/* CONTACT CARDS */}
      <motion.div 
        variants={itemVariants} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
      >
        <ContactCard 
          Icon={MessageCircle} 
          title="WhatsApp" 
          detail="Direct Chat" 
          color="emerald"
          link="https://wa.me/917557721426"
        />
        <ContactCard 
          Icon={Mail} 
          title="Email" 
          detail="contact@taxaadhaar.in" 
          color="blue"
          link="mailto:contact@taxaadhaar.in"
        />
        <ContactCard 
          Icon={Phone} 
          title="Call" 
          detail="+91 75577 21426" 
          color="indigo"
          link="tel:+917557721426"
        />
      </motion.div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* TICKET FORM */}
        <motion.div variants={itemVariants} className="lg:col-span-3 order-2 lg:order-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Raise a Ticket</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Resolution Time: 2-4 Hours</p>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-6 md:p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Select Service Type</label>
                <div className="relative group">
                  <select 
                    required
                    defaultValue=""
                    className="w-full px-5 py-4 text-slate-900 bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none appearance-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>Choose Tax Service</option>
                    <option value="itr">Income Tax (ITR) Filing</option>
                    <option value="gst">GST Registration & Returns</option>
                    <option value="pan">PAN Card Services</option>
                    <option value="other">Other Tax Queries</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <ChevronRight size={18} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Your Message</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full px-5 py-4 text-black bg-slate-50 rounded-2xl text-sm font-bold border-2 border-transparent focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button 
                type="submit"
                disabled={loading || submitted}
                className={`w-full py-5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl
                  ${submitted ? "bg-emerald-500 shadow-emerald-100" : "bg-slate-950 hover:bg-blue-600 shadow-blue-100"} text-white flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50`}
              >
                {loading ? <Loader2 className="animate-spin" /> : submitted ? <CheckCircle /> : <Send size={18} />}
                {loading ? "SENDING..." : submitted ? "TICKET RAISED" : "SUBMIT REQUEST"}
              </button>
            </form>
          </div>
        </motion.div>

        {/* SIDEBAR */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <div className="bg-[#020617] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10">
               <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2 text-blue-400 tracking-widest">
                 <FileQuestion size={20} /> Quick FAQ
               </h3>
               <div className="space-y-3">
                 <FAQLink title="Track Project Progress" />
                 <FAQLink title="Payment Security" />
                 <FAQLink title="Revision Policy" />
               </div>
             </div>
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
             <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">Support Active</p>
             <h4 className="text-xl font-black italic uppercase">Mon - Sat: 10AM - 7PM</h4>
             <p className="text-[9px] mt-4 opacity-60 font-bold uppercase tracking-widest leading-relaxed">Sasaram & Mumbai Offices.</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENTS ---

function ContactCard({ Icon, title, detail, color, link }: ContactCardProps) {
  const colors = {
    emerald: "hover:border-emerald-200 hover:bg-emerald-50/50",
    blue: "hover:border-blue-200 hover:bg-blue-50/50",
    indigo: "hover:border-indigo-200 hover:bg-indigo-50/50",
  };

  return (
    <a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 group active:scale-[0.98] ${colors[color]}`}
    >
      <div className="w-14 h-14 rounded-[1.25rem] bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3 shadow-sm">
        <Icon size={24} /> 
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
      <h3 className="text-base font-black text-slate-900 mt-2 mb-4 tracking-tight">{detail}</h3>
      <div className="text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
        Connect Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}

function FAQLink({ title }: FAQLinkProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 cursor-pointer transition-all group active:bg-white/20">
      <span className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors uppercase">{title}</span>
      <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-all" />
    </div>
  );
}