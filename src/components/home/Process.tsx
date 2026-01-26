export default function Process() {
  const steps = [
    { title: "Quick Enquiry", desc: "Form bharein aur hamare expert se baat karein." },
    { title: "Upload Docs", desc: "PAN, Aadhaar aur Form-16 secure portal par upload karein." },
    { title: "Expert Review", desc: "Hamare dedicated CAs aapka data verify karenge." },
    { title: "Secure Payment", desc: "Apna plan select karein aur transparent payment karein." },
    { title: "Filing Done", desc: "Aapka ITR file ho jayega aur ITR-V turant mil jayega." }
  ];

  return (
    <section id="process" className="py-28 bg-[#020617] text-white overflow-hidden relative">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black tracking-tighter italic">
            TaxAdhaar <span className="text-blue-500">Process</span>
          </h2>
          <p className="text-slate-500 mt-4 font-medium uppercase tracking-[0.3em] text-xs">Filing in 5 Easy Steps</p>
        </div>
        
        {/* Responsive Grid: Mobile me 1, Tablet me 3, Desktop me 5 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 relative">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Step Number behind text */}
              <span className="text-8xl font-black text-slate-800/30 absolute -top-12 -left-2 select-none group-hover:text-blue-500/20 transition-colors duration-500">
                0{i + 1}
              </span>
              
              <div className="relative z-10 pt-4">
                <div className="h-1 w-12 bg-blue-600 mb-6 group-hover:w-20 transition-all duration-500"></div>
                <h4 className="text-xl font-black mb-3 group-hover:text-blue-400 transition-colors">
                  {step.title}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Connector Line for Desktop (Last item chhod kar) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-[1px] bg-slate-800"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}