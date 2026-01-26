import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data Collection",
      content: "Hum aapse wahi jankari lete hain jo Tax filing ke liye zaroori hai, jaise PAN, Aadhaar, Form 16, aur Bank details. Ye data sirf legal compliance ke liye use hota hai."
    },
    {
      title: "Security Measures",
      content: "Aapka data AES-256 encryption ke saath secure kiya jata hai. Hum bank-level security protocols follow karte hain taki aapka sensitive data kabhi leak na ho."
    },
    {
      title: "Third-Party Sharing",
      content: "TaxAdhaar aapka data kisi bhi teesri party ko marketing ke liye nahi bechta. Hum sirf Government portals (Income Tax Dept) ke saath data share karte hain process ko complete karne ke liye."
    }
  ];

  return (
    <main className="bg-white py-24">
         <PublicNavbar/>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">Privacy <span className="text-blue-600">Policy.</span></h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: January 2026</p>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            **TaxAdhaar** ("hum," "humein," ya "hamara") aapki privacy ki dil se izzat karta hai. Ye policy batati hai ki hum aapki information kaise collect, use aur protect karte hain jab aap hamari website ya services use karte hain.
          </p>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">0{i+1}</span>
                  {section.title}
                </h2>
                <p className="text-slate-500 leading-relaxed ml-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">Aapka Rights (Your Rights)</h3>
            <ul className="space-y-3 text-slate-500 text-sm font-medium list-disc ml-5">
              <li>Aap jab chahe apna account aur data delete karne ki request kar sakte hain.</li>
              <li>Aap dekh sakte hain ki humne aapka kaunsa data store kiya hai.</li>
              <li>Aap kisi bhi galat info ko update karwa sakte hain.</li>
            </ul>
          </div>

          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium">
              Privacy se juda koi sawal hai? Hamein mail karein: 
              <span className="text-blue-600 font-black ml-1 cursor-pointer">privacy@taxadhaar.in</span>
            </p>
          </div>
        </div>

        {/* Home Button */}
        <div className="mt-16 text-center">
          <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-600 transition-all active:scale-95">
            Back to Home
          </Link>
        </div>
      </div>
      <Footer/>
    </main>
  );
}