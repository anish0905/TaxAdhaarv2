import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Disclaimer | TaxAdhaar - Official Financial News Clarification",
  description: "Official legal disclaimer for TaxAdhaar. We are an independent financial updates and educational news portal and not affiliated with any government entity.",
};

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <PublicNavbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            Legal & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4">
            Disclaimer
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Last Updated: June 15, 2026
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8 leading-relaxed text-base md:text-lg">
          
          {/* CRITICAL WARNING BOX FOR ADSENSE & GOVERNMENT SAFETY */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 flex items-start gap-4">
            <span className="text-2xl mt-0.5">⚠️</span>
            <div className="text-sm md:text-base font-medium">
              <strong className="font-bold text-amber-950">Important Notice (Non-Government Affiliation):</strong> <br />
              TaxAdhaar (<a href="https://taxadhaar.com" className="underline font-bold text-blue-600">taxadhaar.com</a>) operates strictly as an independent, privately-owned digital resource, news, and educational platform. **We do not hold any official affiliation, association, direct connection, or authorization with the Government of India, the Income Tax Department, the GST Council, or any other state or central sovereign administrative body.**
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              1. Educational & Informational Purpose Only
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              All articles, analytical news, user guides, computation tables, and interactive calculations published across this platform are curated strictly for general informational and educational purposes. Financial regulations and tax codes are highly complex and subject to frequent modifications; therefore, the contents herein should not be construed as statutory, legal, or professional financial advice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              2. Accuracy & Limitation of Liability
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              While our editorial team, computational tools, and analytical experts execute reasonable verification practices to evaluate regulatory metrics—including provisions under relevant tax legislation and official circulars—TaxAdhaar provides no implicit or explicit warranty regarding the absolute completeness, accuracy, or real-time precision of the published materials. 
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              3. Mandate for Professional Consultation
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Users are strongly advised to seek independent counsel from a certified professional, such as a registered **Chartered Accountant (CA)** or qualified financial consultant, prior to executing investment strategies, filing tax compliance documentation, or managing financial liabilities based on our content. TaxAdhaar and its promoters accept no legal or fiscal liability for direct, indirect, consequential, or incidental losses or damages resulting from reliance on platform data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              4. External Links & Third-Party Platforms
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              For informational convenience, hyperlinked routing to official regulatory architecture (such as <em>incometax.gov.in</em> or <em>gst.gov.in</em>) is integrated within our materials. These external domains are managed entirely by sovereign or separate third-party operations. TaxAdhaar maintains no computational control over, and assumes no systemic liability for, the verification, tracking, or practices of external digital infrastructures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              5. Verification via Official Portals
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              Taxpayers, individual users, and corporate entities are urged to validate any policy updates, compliance rules, statutory notifications, or amendments exclusively through the official government documentation pipelines:
            </p>
            <ul className="list-disc pl-6 text-sm text-slate-600 space-y-1 font-medium">
              <li>Income Tax E-Filing System: <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.incometax.gov.in</a></li>
              <li>Official GST Portal Architecture: <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.gst.gov.in</a></li>
              <li>Ministry of Corporate Affairs (MCA): <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.mca.gov.in</a></li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
