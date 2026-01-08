export default function Stats() {
  const data = [
    { label: "Active Clients", value: "15,000+", icon: "👥" },
    { label: "Tax Saved", value: "₹8.5 Cr+", icon: "💰" },
    { label: "Expert CAs", value: "25+", icon: "👨‍💼" },
    { label: "Success Rate", value: "99.9%", icon: "✅" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {data.map((item, i) => (
          <div key={i} className="text-center group p-8 rounded-[2rem] hover:bg-slate-50 transition-all duration-500">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{item.icon}</div>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{item.value}</h3>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}