import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            TAX<span className="text-slate-900">ADHAAR</span>
          </Link>
          <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium">
            India's most trusted digital tax filing platform. Simplifying taxes for individuals and startups.
          </p>
          {/* Social Links - Viral hone ke liye zaroori hain */}
          <div className="flex gap-4 mt-6">
            <div className="w-8 h-8 rounded-full text-black bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">𝕏</div>
            <div className="w-8 h-8 rounded-full text-black bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all cursor-pointer">in</div>
            <div className="w-8 h-8 rounded-full text-black bg-slate-100 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all cursor-pointer">ig</div>
          </div>
        </div>
        
        {/* Services */}
        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Services</h4>
          <ul className="space-y-3 text-slate-800 text-sm font-bold">
            <li><Link href="/itr" className="hover:text-blue-600 transition-colors">Income Tax Filing</Link></li>
            <li><Link href="/gst" className="hover:text-blue-600 transition-colors">GST Registration</Link></li>
            <li><Link href="/setup" className="hover:text-blue-600 transition-colors">Business Setup</Link></li>
            <li><Link href="/audit" className="hover:text-blue-600 transition-colors">Tax Audit</Link></li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Company</h4>
          <ul className="space-y-3 text-slate-800 text-sm font-bold">
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Newsletter / Lead Capture - "Viral" hone ke liye data chahiye */}
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-4">Tax Updates & Offers</h4>
          <div className="flex flex-col gap-2  text-black">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white border border-blue-200 px-4 py-3 rounded-2xl text-sm outline-none focus:ring-2 ring-blue-500/20"
            />
            <button className="bg-blue-600 text-white font-bold py-3 rounded-2xl text-sm hover:bg-blue-700 transition-all active:scale-95">
              Subscribe
            </button>
          </div>
          <p className="text-[10px] text-blue-400 mt-3 font-bold uppercase tracking-wider text-center italic">Join 500+ Early Users</p>
        </div>
      </div>

      {/* Bottom Bar: Trust & Payments */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 TAXADHAAR DIGITAL SOLUTIONS</p>
          <p className="text-slate-800 text-[9px] mt-1 font-bold">POWERED BY RAZORPAY SECURE ENGINE</p>
        </div>

        {/* Trust Badges - Mandatory for Razorpay & Security */}
        <div className="flex flex-wrap justify-center gap-6 items-center grayscale opacity-60 hover:opacity-100 transition-opacity text-black">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black mb-1">PAYMENT PARTNER</span>
            <span className="text-xs font-black tracking-tighter">RAZORPAY</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-200 pl-6">
            <span className="text-[8px] font-black mb-1">SECURITY</span>
            <span className="text-xs font-black tracking-tighter uppercase">SSL SECURE</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-200 pl-6">
            <span className="text-[8px] font-black mb-1">VERIFIED</span>
            <span className="text-xs font-black tracking-tighter">STARTUP INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}