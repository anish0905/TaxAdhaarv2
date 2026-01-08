// src/components/home/Services.tsx
const services = [
  { title: "Income Tax", desc: "Assisted ITR filing for Salaried & Business", icon: "📊", color: "blue" },
  { title: "GST Compliance", desc: "Registration, Returns & Annual Filing", icon: "🏢", color: "green" },
  { title: "Business Setup", desc: "Pvt Ltd, LLP, Partnership & MSME", icon: "🚀", color: "purple" },
  { title: "Trademark", desc: "Brand Name & Logo Registration", icon: "🛡️", color: "orange" },
  { title: "FSSAI License", desc: "Food License for Restaurants & Outlets", icon: "🍎", color: "red" },
  { title: "Audit & Advise", desc: "Tax Audit & Financial Planning", icon: "⚖️", color: "slate" },
];

export default function Services() {
  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-slate-900">Our Services</h2>
        <p className="text-slate-500 mt-4">One-stop solution for all your legal and financial compliance needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((s, i) => (
          <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-6 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">{s.desc}</p>
            <button className="text-blue-600 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
              Know More <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}