import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
            TAX<span className="text-slate-900">CLEAR</span>
          </Link>
          <p className="text-slate-500 text-sm mt-4 leading-relaxed font-medium">
            India's most trusted digital tax filing platform for individuals and businesses.
          </p>
        </div>
        
        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Services</h4>
          <ul className="space-y-3 text-slate-500 text-sm font-bold">
            <li className="hover:text-blue-600 cursor-pointer">Income Tax Filing</li>
            <li className="hover:text-blue-600 cursor-pointer">GST Registration</li>
            <li className="hover:text-blue-600 cursor-pointer">Business Setup</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em] mb-6">Company</h4>
          <ul className="space-y-3 text-slate-500 text-sm font-bold">
            <li className="hover:text-blue-600 cursor-pointer">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact</li>
            <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem]">
          <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4">Support</h4>
          <p className="text-xl font-black text-blue-600 underline">support@taxclear.com</p>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Mon-Sat: 10AM - 7PM</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-slate-50 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2026 TAXPORTAL INDIA PVT LTD</p>
        <div className="flex gap-6 opacity-40 grayscale">
          {/* Payment Badges like Visa/Mastercard icons can go here */}
          <span className="text-xs font-black">VISA</span>
          <span className="text-xs font-black">RAZORPAY</span>
          <span className="text-xs font-black">SECURE-SSL</span>
        </div>
      </div>
    </footer>
  );
}