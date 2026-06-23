import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function RefundPolicy() {
  const sections = [
    {
      title: "Cancellation Policy",
      content: "Once a payment is processed for any service on TaxAdhaar (including ITR Filing, GST Registration, or Tax Consultation), cancellation requests are only permissible up until our assigned financial experts have commenced processing your documents. Once active professional work or document submission has begun, orders cannot be cancelled or modified."
    },
    {
      title: "Refund Eligibility",
      content: "Refunds are explicitly restricted to scenarios where TaxAdhaar is completely unable to deliver the committed compliance services due to internal technical failures or systemic operational issues. Refund claims will be deemed invalid if service delays occur due to inaccurate user data or a failure to upload required financial documents."
    },
    {
      title: "Duplicate Payments & Failed Transactions",
      content: "In the event of a transaction failure caused by server communication issues or payment gateway timeouts—where funds are debited from your bank account without an order confirmation—the amount is safe. Such duplicate charges are automatically reversed through our payment gateway provider (Razorpay) and credited back to your original payment mode (Bank Account/UPI/Card) within 5 to 7 working days."
    },
    {
      title: "How to Request a Refund",
      content: "To initiate a genuine refund assessment, please submit a formal email request to our support desk including your unique Transaction ID, Registered Email Address, and original payment receipt. Every claim undergoes manual forensic verification, and valid disbursements are advanced through proper financial channels."
    }
  ];

  return (
    <main className="bg-white py-24">
      <PublicNavbar />
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">
            Cancellation & <span className="text-blue-600">Refunds.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            At **TaxAdhaar**, we strive to maintain complete financial transparency and deliver top-tier professional tax compliance solutions. Please review our Cancellation and Refund policy thoroughly to understand the operational rules governing payment settlements and service delivery.
          </p>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
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
            <h3 className="text-lg font-black text-slate-900 mb-4">Grievance Redressal & Support</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              For any escalation, settlement queries, or disputes regarding automated billing, please contact our dedicated finance unit. We investigate every legitimate issue with high priority to ensure fair dispute resolution.
            </p>
          </div>

          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium">
              Have questions regarding our refund parameters? Contact us directly: 
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