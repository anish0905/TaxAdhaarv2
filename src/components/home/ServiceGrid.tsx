"use client";
import { useState } from "react";
import Link from "next/link";
import EnquiryModal from "./EnquiryModal";

const services = [
  { 
    slug: "income-tax",
    title: "Income Tax", 
    desc: "Expert assisted ITR filing with maximum deductions and accurate tax planning.", 
    icon: "💎", 
    color: "from-blue-50 to-white", 
    border: "border-blue-100",
    btnColor: "bg-blue-600 shadow-blue-100"
  },
  { 
    slug: "gst-filing",
    title: "GST Filing", 
    desc: "Seamless monthly returns, GST registration & reconciliation for your growing business.", 
    icon: "⚡", 
    color: "from-emerald-50 to-white", 
    border: "border-emerald-100",
    btnColor: "bg-emerald-600 shadow-emerald-100"
  },
  { 
    slug: "business-setup",
    title: "Business Setup", 
    desc: "Company registration, LLP formation & MSME certification in just 3 working days.", 
    icon: "🚀", 
    color: "from-purple-50 to-white", 
    border: "border-purple-100",
    btnColor: "bg-purple-600 shadow-purple-100"
  }
];

export default function ServiceGrid() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const openPopup = (title: string) => {
    setSelectedService(title);
    setIsModalOpen(true);
  };

  return (
    <section id="services" className="px-6 py-28 max-w-7xl mx-auto">
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceName={selectedService}
      />

      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
          Choose Your Service
        </h2>
        <p className="text-slate-500 font-medium text-lg italic">
          Transparent pricing. Dedicated Support. Professional Accuracy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {services.map((s, i) => (
          <div 
            key={i} 
            className={`flex flex-col bg-gradient-to-b ${s.color} p-10 rounded-[3rem] border ${s.border} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group`}
          >
            <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">
              {s.icon}
            </div>
            
            <h3 className="text-2xl font-black mb-4 text-slate-900">
              {s.title}
            </h3>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-grow">
              {s.desc}
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => openPopup(s.title)}
                className={`w-full py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${s.btnColor}`}
              >
                Instant Enquiry
              </button>
              
              <Link 
                href={`/services/${s.slug}`}
                className="block w-full py-4 rounded-2xl text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] text-center border border-slate-200 hover:bg-white transition-all active:scale-95"
              >
                View Details & Docs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}