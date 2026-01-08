export function HowItWorks() {
  const steps = [
    { title: "Enquire", desc: "Select service and share details." },
    { title: "Expert Call", desc: "Our CA/Expert calls you for info." },
    { title: "Documentation", desc: "Upload docs on your dashboard." },
    { title: "Filing", desc: "We file and send acknowledgment." },
  ];

  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16">Simple 4-Step Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                {i + 1}
              </div>
              <h4 className="font-bold mb-2">{step.title}</h4>
              <p className="text-slate-400 text-sm">{step.desc}</p>
              {i < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-full border-t border-dashed border-slate-700" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}