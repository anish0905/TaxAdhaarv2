
import Footer from "@/components/Footer";
import FAQ from "@/components/home/FAQ";
import HeroForm from "@/components/home/HeroForm";
import Process from "@/components/home/Process";
import ServiceGrid from "@/components/home/ServiceGrid";
import Stats from "@/components/home/Stats";
import TrustSlider from "@/components/home/TrustSlider";


export default function HomePage() {
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-600">
     

      {/* --- HERO SECTION --- */}
      <section className="relative px-6 py-16 md:py-28 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full shadow-sm group cursor-default">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </span>
            <span className="text-blue-700 text-xs font-bold uppercase tracking-wider group-hover:text-blue-800 transition-colors">
              ★ Government Licensed Tax Portal
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter">
            Smart Tax <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 drop-shadow-sm">
              Solutions.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
            India's most intuitive platform for <span className="text-slate-900 font-bold underline decoration-blue-200 decoration-4 underline-offset-4">ITR Filing</span>, GST, and Business Setup. Trusted by 1M+ Taxpayers.
          </p>
          
          <div className="flex flex-wrap gap-8 pt-4">
            <div className="group">
              <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">₹4.5Cr+</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Refunds Processed</p>
            </div>
            <div className="h-12 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="group">
              <p className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">150+</p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">Expert CA Team</p>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: PREMIUM 3D FORM --- */}
        <div className="flex-1 w-full max-w-lg relative group">
           {/* Glow Effect behind form */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          <HeroForm />
        </div>
      </section>
<ServiceGrid />
      {/* --- TRUST BADGES (Glassmorphism Style) --- */}
     <TrustSlider/>
     <FAQ/>
     <Stats/>
     <Process/>
     <Footer/>
 

    
    </div>
  );
}