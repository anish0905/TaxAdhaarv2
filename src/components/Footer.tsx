import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <div className="mb-4">
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter block">
              TAX<span className="text-slate-900">ADHAAR</span>
            </Link>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            India&apos;s digital tax compliance platform. Simplifying corporate filing, ITR registration, and statutory bookkeeping for enterprises and startups.
          </p>
        </div>
        
        {/* Services - FIXED: Hardcoded actual operational routes instead of # */}
        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Services Hub</h4>
          <ul className="space-y-3 text-slate-800 text-sm font-bold">
            <li><Link href="/services/income-tax" className="hover:text-blue-600 transition-colors">Income Tax Filing</Link></li>
            <li><Link href="/services/gst-registration" className="hover:text-blue-600 transition-colors">GST Registration</Link></li>
            <li><Link href="/services/business-setup" className="hover:text-blue-600 transition-colors">Business Setup</Link></li>
            <li><Link href="/services/tax-audit" className="hover:text-blue-600 transition-colors">Tax Audit Verification</Link></li>
          </ul>
        </div>

        {/* Company & Compliance Links (AdSense & Razorpay Clean Check) */}
        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Legal & Corporate</h4>
          <ul className="space-y-3 text-slate-800 text-sm font-bold">
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Support Desk</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            <li><Link href="/refund-policy" className="hover:text-blue-600 transition-colors">Refund & Cancellation</Link></li>
            <li><Link href="/disclaimer" className="hover:text-blue-600 transition-colors text-blue-600">Compliance Disclaimer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
          <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-4">Need help?</h4>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">For service questions or support, send our team an enquiry.</p>
          <Link href="/contact" className="block bg-blue-600 text-center text-white font-bold py-3 rounded-2xl text-sm hover:bg-blue-700 transition-all">Contact support</Link>
        </div>
      </div>

      {/* Bottom Bar: Trust & Payments */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-slate-800 text-[10px] font-black uppercase tracking-[0.3em]">© 2026 TAXADHAAR DIGITAL SOLUTIONS</p>
          <p className="text-slate-800 text-[9px] mt-1 font-bold">POWERED BY RAZORPAY SECURE CORE ENGINE</p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 items-center grayscale opacity-60 hover:opacity-100 transition-opacity text-black">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black mb-1">PAYMENT GATEWAY</span>
            <span className="text-xs font-black tracking-tighter">RAZORPAY</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-200 pl-6">
            <span className="text-[8px] font-black mb-1">DATA PROTECTION</span>
            <span className="text-xs font-black tracking-tighter uppercase">SSL ENCRYPTED</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-200 pl-6">
            <span className="text-[8px] font-black mb-1">RECOGNITION</span>
            <span className="text-xs font-black tracking-tighter">STARTUP INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
