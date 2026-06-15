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
              <strong className="font-bold text-amber-950">महत्वपूर्ण सूचना (Non-Government Affiliation):</strong> <br />
              TaxAdhaar (<a href="https://www.taxadhaar.com" className="underline font-bold text-blue-600">taxadhaar.com</a>) एक स्वतंत्र निजी डिजिटल न्यूज़, ब्लॉग और एजुकेशनल पोर्टल है। **हमारा भारत सरकार, आयकर विभाग (Income Tax Department), जीएसटी काउंसिल (GST Council), या किसी भी अन्य प्रांतीय या केंद्रीय सरकारी संगठन से कोई सीधा, अप्रत्यक्ष या आधिकारिक संबंध नहीं है।**
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              1. सूचना का उद्देश्य (Educational Purpose Only)
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              इस वेबसाइट पर प्रकाशित सभी आर्टिकल्स, समाचार, गाइड्स, टेबल्स और कैलकुलेशन केवल सामान्य सूचनात्मक और शैक्षिक उद्देश्यों (Educational and Informational purposes) के लिए हैं। टैक्स कानून और वित्तीय नियम अत्यंत जटिल होते हैं और लगातार बदलते रहते हैं, इसलिए इस साइट पर दी गई जानकारी को किसी भी प्रकार की आधिकारिक वित्तीय, कानूनी या व्यावसायिक सलाह (Professional Financial Advice) न माना जाए।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              2. सटीकता और गारंटी (Accuracy of Information)
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              यद्यपि हमारी टीम (Chartered Accountants और वित्तीय विश्लेषकों) द्वारा सभी वित्तीय डेटा, जैसे कि आयकर अधिनियम 2025, जीएसटी सर्कुलर्स और मार्केट एनालिसिस को पूरी तरह से जांच-परख कर और सटीक रूप से प्रस्तुत करने का हरसंभव प्रयास किया जाता है; फिर भी, TaxAdhaar इस बात की कोई पूर्ण गारंटी या वारंटी नहीं देता है कि यहाँ दी गई सामग्री 100% त्रुटिहीन, पूर्ण या पूरी तरह से अप-टू-डेट है। 
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              3. व्यावसायिक परामर्श की अनिवार्यता (Consult a Professional)
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              इस वेबसाइट से प्राप्त जानकारी के आधार पर कोई भी वित्तीय निवेश करने, आईटीआर (ITR) दाखिल करने, टैक्स लायबिलिटी की गणना करने या व्यापारिक निर्णय लेने से पहले, आपको एक योग्य और प्रमाणित पेशेवर जैसे कि पंजीकृत **Chartered Accountant (CA)** या वित्तीय सलाहकार से व्यक्तिगत परामर्श लेने की सख्त सलाह दी जाती है। इस साइट की सामग्री पर भरोसा करके किए गए किसी भी निर्णय से होने वाले सीधे या अप्रत्यक्ष नुकसान (Loss or Damage) के लिए TaxAdhaar या इसके प्रमोटर्स कानूनी रूप से उत्तरदायी नहीं होंगे।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              4. बाहरी लिंक्स (External Links Disclaimer)
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              हमारी वेबसाइट पर पाठकों की सुविधा के लिए आधिकारिक सरकारी पोर्टल्स (जैसे कि <em>incometax.gov.in</em> या <em>gst.gov.in</em>) के हाइपरलिंक्स दिए जा सकते हैं। ये बाहरी वेबसाइटें पूरी तरह से स्वतंत्र तीसरे पक्षों (Third Parties) द्वारा संचालित की जाती हैं। TaxAdhaar इन बाहरी वेबसाइटों की सामग्री, नीतियों, या उनके द्वारा प्रदान की जाने वाली सेवाओं की प्रामाणिकता पर कोई नियंत्रण नहीं रखता है और न ही उनकी ज़िम्मेदारी लेता है।
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b pb-2">
              5. आधिकारिक वेबसाइटों की जानकारी (Official Portals Reference)
            </h2>
            <p className="text-slate-600 text-sm md:text-base">
              करदाताओं और व्यापारियों को दृढ़ता से सलाह दी जाती है कि वे किसी भी नियम, सर्कुलर, या नोटिफिकेशन की प्रामाणिकता की पुष्टि के लिए केवल और केवल सरकार के आधिकारिक सरकारी चैनलों का ही उपयोग करें:
            </p>
            <ul className="list-disc pl-6 text-sm text-slate-600 space-y-1">
              <li>इनकम टैक्स ई-फाइलिंग के लिए: <a href="https://www.incometax.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.incometax.gov.in</a></li>
              <li>जीएसटी पोर्टल के लिए: <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.gst.gov.in</a></li>
              <li>कॉर्पोरेट मामलों (MCA) के लिए: <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">www.mca.gov.in</a></li>
            </ul>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}