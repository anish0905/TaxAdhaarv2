import Footer from '@/components/Footer';
import PublicNavbar from '@/components/Navbar';
import Link from 'next/link';

export default function TermsOfService() {
  const terms = [
    {
      title: "Services Provided",
      content: "TaxAdhaar provides digital technology solutions and programmatic infrastructure to facilitate income tax return (ITR) filing, GST compliance registration, and automated corporate tax consultation. We leverage secure software systems to simplify and streamline your overall accounting workflows."
    },
    {
      title: "User Responsibility & Document Accuracy",
      content: "You assume absolute accountability for the precision, integrity, and legitimacy of all credentials, certificates, and financial documentation provided (including PAN, identifiers, and income tax statements). TaxAdhaar rejects all liability for penalties, legal updates, or compliance interest arising from incorrect or fraudulent disclosures."
    },
    {
      title: "Payment, Terms & Refund Framework",
      content: "All transactional billing for cloud software access or professional curation is managed through upfront payments. Once our verification experts or computational tools begin evaluating your specific tax data parameters, refunds cannot be initialized, except in verified cases of internal software delivery failure."
    },
    {
      title: "Data Confidentiality & Legal Compliance",
      content: "Your uploaded database records are processed strictly for execution of your chosen tax filing procedures. We adhere to rigid privacy constraints, and your information is never shared, bartered, or transmitted to any third-party entity except authorized government portals."
    }
  ];

  return (
    <main className="bg-white py-24">
      <PublicNavbar />
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
            Please read these Terms of Service carefully before utilizing the systems, tools, and digital platform hosted by **TaxAdhaar**. By accessing or interacting with our applications, you explicitly acknowledge compliance and consent to these binding legal provisions.
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
              TaxAdhaar operates strictly as an independent financial technology facilitator and cloud platform. We are not an official branch, subsidiary, or direct representative of the Income Tax Department or any sovereign government authority. Computational finality and official assessments are subject to independent government verification.
            </p>
          </div>

          {/* Contact for Legal */}
          <div className="mt-12 text-center border-t border-slate-100 pt-12">
            <p className="text-slate-400 text-sm font-medium italic">
              Have questions or inquiries regarding our legal frameworks? Contact our compliance division:
              <br />
              <span className="text-blue-600 font-black not-italic">legal@taxadhaar.com</span>
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
      <Footer />
    </main>
  );
}