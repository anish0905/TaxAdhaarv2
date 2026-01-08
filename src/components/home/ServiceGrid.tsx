"use client";

const services = [
  { 
    title: "Income Tax", 
    desc: "Expert assisted ITR filing with maximum deductions and accurate tax planning.", 
    icon: "💎", 
    color: "from-blue-50 to-white", 
    border: "border-blue-100" 
  },
  { 
    title: "GST Filing", 
    desc: "Seamless monthly returns, GST registration & reconciliation for your growing business.", 
    icon: "⚡", 
    color: "from-emerald-50 to-white", 
    border: "border-emerald-100" 
  },
  { 
    title: "Business Setup", 
    desc: "Company registration, LLP formation & MSME certification in just 3 working days.", 
    icon: "🚀", 
    color: "from-purple-50 to-white", 
    border: "border-purple-100" 
  }
];

export default function ServiceGrid() {
  return (
    <section id="services" className="px-6 py-28 max-w-7xl mx-auto">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">
          Choose Your Service
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          Transparent pricing. Dedicated Support. Professional Accuracy.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {services.map((s, i) => (
          <div 
            key={i} 
            className={`bg-gradient-to-b ${s.color} p-12 rounded-[2.5rem] border ${s.border} hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group`}
          >
            <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">
              {s.icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600">
              {s.title}
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed mb-8">
              {s.desc}
            </p>
            {/* Animated Bottom Line */}
            <div className="h-[2px] w-12 bg-slate-200 group-hover:w-full transition-all duration-500 group-hover:bg-blue-600"></div>
          </div>
        ))}
      </div>
    </section>
  );
}