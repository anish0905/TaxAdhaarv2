import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function TermsOfService() {
  const terms = [
    {
      title: "Services Provided",
      content: "TaxAdhaar digital platform ke madhyam se ITR filing, GST registration, aur tax consultation services provide karta hai. Hum technology ka use karke aapke tax process ko simplify karte hain."
    },
    {
      title: "User Responsibility",
      content: "Aap jo bhi documents (PAN, Aadhaar, Form 16) provide karenge, unki accuracy ki zimmedari aapki hogi. Galat jankari se hone wali kisi bhi penalty ke liye TaxAdhaar responsible nahi hoga."
    },
    {
      title: "Payment & Refunds",
      content: "Services ke liye payment advance mein li jati hai. Ek baar jab CA review process shuru ho jata hai, toh refund process nahi kiya ja sakta. Halaki, service failure ke case mein hum full refund provide karte hain."
    },
    {
      title: "Data Confidentiality",
      content: "Hum aapka data sirf Tax filing purposes ke liye use karte hain. Aapka data government authorities ke alawa kisi aur third-party ke saath share nahi kiya jata."
    }
  ];

  return (
    <main className="bg-white py-24">
         <PublicNavbar/>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Section */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">
            Terms of <span className="text-blue-600">Service.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Effective Date: January 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            TaxAdhaar website use karne se pehle kripya in terms ko dhyan se padhein. Hamari services use karne ka matlab hai ki aap in terms se sehmat hain.
          </p>

          {/* Terms Grid/List */}
          <div className="space-y-12">
            {terms.map((term, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-0 top-0 text-blue-600 font-black text-2xl opacity-20 select-none">
                  {i + 1}.
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                  {term.title}
                </h2>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {term.content}
                </p>
              </div>
            ))}
          </div>

          {/* Important Note Box */}
          <div className="mt-16 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
            <h3 className="text-blue-900 font-black mb-3 flex items-center gap-2">
              <span>⚠️</span> Important Disclaimer
            </h3>
            <p className="text-blue-700/80 text-sm leading-relaxed font-medium">
              TaxAdhaar ek facilitator hai. Hum Income Tax Department ya kisi government body ka hissa nahi hain. Hum sirf aapki taraf se filing process ko asaan banate hain. Final assessment department ke rules ke mutabik hi hota hai.
            </p>
          </div>

          {/* Contact for Legal */}
          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium italic">
              Agar aapko in terms se koi problem hai, toh humein contact karein:
              <br />
              <span className="text-blue-600 font-black not-italic">legal@taxadhaar.in</span>
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center gap-4">
          <Link href="/" className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
            I Understand
          </Link>
        </div>
      </div>
      <Footer/>
    </main>
  );
}