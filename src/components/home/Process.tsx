export default function Process() {
  const steps = [
    { title: "Quick Enquiry", desc: "Fill the form & get a callback." },
    { title: "Upload Docs", desc: "Share PAN & Form 16 on portal." },
    { title: "Expert Review", desc: "Our CA verifies your data." },
    { title: "Filing Done", desc: "Get your ITR-V within minutes." }
  ];

  return (
    <section className="py-28 bg-[#020617] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-5xl font-black mb-20 text-center tracking-tighter italic">Simple. Fast. <span className="text-blue-500">Secure.</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <span className="text-8xl font-black text-slate-800/50 absolute -top-10 -left-4 select-none">0{i+1}</span>
              <div className="relative z-10 pt-4">
                <h4 className="text-xl font-black mb-3">{step.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}