export default function Stats() {
  const data = [
    { label: "Service Status", value: "ACTIVE", icon: "🟢" },
    { label: "Data Privacy", value: "100%", icon: "🛡️" },
    { label: "Expert Network", value: "CA Assisted", icon: "⚖️" },
    { label: "Process Time", value: "Paperless", icon: "📲" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Branding Header */}
        <div className="text-center mb-16">
          <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            Welcome to TaxAdhaar
          </span>
          <h2 className="text-4xl font-black text-slate-900 mt-4 tracking-tight">
            Simplifying Taxes for Everyone
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.map((item, i) => (
            <div 
              key={i} 
              className="relative group p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Subtle Background Accent */}
              <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">
                {item.icon}
              </div>
              
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500 origin-left">
                {item.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {item.value}
              </h3>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}