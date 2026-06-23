import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect only the essential information required for tax filing, GST compliance, and automated accounting processing. This includes sensitive credentials or identifiers such as PAN, financial documents like Form 16, and bank account details. Your data is handled securely and is never shared without your explicit consent."
    },
    {
      title: "Cookies & Analytics Tracking",
      content: "Our website utilizes Google Analytics (GA4) to evaluate traffic and understand user behavior patterns. Cookies are small data files placed on your browser to optimize overall system performance and user experience. You retain the absolute right to refuse or disable cookies through your individual browser settings."
    },
    {
      title: "Google AdSense & Third-Party Advertising",
      content: "We use Google AdSense to serve advertisements across our platform. Google, as a third-party vendor, uses cookies (including the DART cookie mechanism) to serve targeted ads based on your visits to TaxAdhaar and other internet domains. Users can choose to opt-out of personalized advertising by reviewing the Google Ad and Content Network Privacy Policy."
    },
    {
      title: "Advanced Security Measures",
      content: "Your highly confidential corporate and financial records are protected using robust AES-256 bit encryption algorithms and transmission protocols (SSL/TLS certificates). We strictly adhere to industry-standard internal controls and bank-grade digital security guidelines to completely neutralize unauthorized programmatic access."
    },
    {
      title: "Data Sharing & Disclosure Policy",
      content: "TaxAdhaar does not lease, barter, or sell your personal or financial data to third-party marketing brokers. Data sharing is limited exclusively to authorized government portals (such as the Income Tax Department or GSTN infrastructure) through secure application programming interfaces (APIs) to successfully execute your tax compliance processes."
    }
  ];

  return (
    <main className="bg-white py-24">
      <PublicNavbar />
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 border-b border-slate-100 pb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 italic">
            Privacy <span className="text-blue-600">Policy.</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Last Updated: June 2026</p>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-slate-600 leading-relaxed mb-10">
            At **TaxAdhaar** ("we," "us," or "our"), we deeply respect your digital privacy. This comprehensive Privacy Policy defines exactly how your electronic information is aggregated, parsed, and shielded when utilizing our website, tools, or integrated SaaS compliance solutions.
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
            <h3 className="text-lg font-black text-slate-900 mb-4">Your Rights & Control</h3>
            <ul className="space-y-3 text-slate-500 text-sm font-medium list-disc ml-5">
              <li>You can request the permanent deletion of your user profile and database records at any time.</li>
              <li>You hold the right to download a clean inventory of the historical records stored within our system.</li>
              <li>You can immediately correct or update obsolete records directly inside your system profile workspace.</li>
            </ul>
          </div>

          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium">
              Have questions regarding data handling or compliance? Email us at: 
              <span className="text-blue-600 font-black ml-1 cursor-pointer">privacy@taxadhaar.com</span>
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