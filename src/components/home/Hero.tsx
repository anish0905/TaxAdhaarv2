// src/components/home/Hero.tsx
export default function Hero() {
  return (
    <section className="bg-slate-50 pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
            Trusted by 5000+ Businesses
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
            Simplify your <span className="text-blue-600">Tax & Compliance</span> journey.
          </h1>
          <p className="text-lg text-slate-600 mt-6">
            Get expert assistance for ITR, GST, and Business Registration. High accuracy, 
            zero stress, and the fastest filing experience in India.
          </p>
        </div>

        {/* Quick Enquiry Card */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 max-w-md mx-auto w-full">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Talk to a Tax Expert</h3>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-black"
            />
            <input 
              type="text" 
              placeholder="Mobile Number" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-black"
            />
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none text-black bg-white">
              <option>Select Service</option>
              <option>ITR Filing</option>
              <option>GST Registration</option>
              <option>Company Setup</option>
            </select>
            <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              Get Free Consultation
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4">No spam. Only expert advice.</p>
        </div>
      </div>
    </section>
  );
}