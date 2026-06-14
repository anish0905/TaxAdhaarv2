import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function RefundPolicy() {
  const sections = [
    {
      title: "Cancellation Policy",
      content: "Ek baar jab aap TaxAdhaar par kisi bhi service (jaise ITR Filing, GST Registration, ya Tax Consultation) ke liye payment kar dete hain, toh cancellation tabhi tak possible hai jab tak hamare Experts aapke document par kaam shuru nahi karte. Process shuru hone ke baad order cancel nahi kiya ja sakega."
    },
    {
      title: "Refund Eligibility",
      content: "Hum refunds sirf tabhi process karte hain jab hum kisi technical issue ki wajah se aapko commitment ke mutabik service dene mein poori tarah asamarth (unable) hon. Agar aap galat documents upload karte hain ya delay aapki taraf se hota hai, toh refund claim valid nahi mana jayega."
    },
    {
      title: "Duplicate Payments / Failed Transactions",
      content: "Agar transaction ke waqt server error ya payment gateway glitch ki wajah se aapke bank account se paise kat jaate hain lekin TaxAdhaar par order confirm nahi hota, toh ghabraiye mat. Aise cases mein amount Razorpay ke standard automated system ke throw 5-7 working days ke andar aapke original payment mode (Bank account/UPI/Card) mein wapas credit kar diya jata hai."
    },
    {
      title: "How to Request a Refund",
      content: "Kisi bhi genuine refund request ke liye aap hamari support team ko apni Transaction ID, Registered Email, aur payment receipt ke saath mail kar sakte hain. Hum har request ko manually verify karte hain aur valid paye jaane par process aage badhate hain."
    }
  ];

  return (
    <main className="bg-white py-24">
      <PublicNavbar />
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">
            Refund & <span className="text-blue-600">Cancellation.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            **TaxAdhaar** par hum apne har client ko transparent aur best professional services dene ke liye committed hain. Hamari Refund aur Cancellation policy ko dhyan se padhein taaki payment aur service delivery se jude saare rules aapko clear rahein.
          </p>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                    0{i + 1}
                  </span>
                  {section.title}
                </h2>
                <p className="text-slate-500 leading-relaxed ml-11">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">Grievance & Support</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Refunds, settlements, ya billing se judi kisi bhi query ke liye aap hamari finance unit ko contact kar sakte hain. Hum har legitimate issue ko priority par solve karte hain.
            </p>
          </div>

          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium">
              Refund se juda koi bhi sawal hai? Hamein direct contact karein: 
              <span className="text-blue-600 font-black ml-1 cursor-pointer">support@taxadhaar.com</span>
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
      <Footer />
    </main>
  );
}