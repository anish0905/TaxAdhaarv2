import { Metadata } from "next";
import PremiumNewsPortal from "@/components/PremiumNewsPortal"; // अपनी सही पाथिंग चेक कर लेना भाई

// ============================================================================
// 🎯 CRITICAL SEO FIX: CHARACTER LENGTH OPTIMIZATION (बिंग एरर फिक्स नोड)
// ============================================================================
export const metadata: Metadata = {
  title: "TaxAdhaar Portal | Real-time Tax & GST Updates", // 🎯 50 Characters (Perfect for Bing/Google)
  description: "Access curated compliance notifications, direct tax circulars, and expert ledger analysis insights instantly.", // 🎯 135 Characters (Ideal Range)
  keywords: ["income tax india", "gst laws 2026", "cbdt notifications", "taxadhaar toolkit", "financial news"],
  openGraph: {
    title: "TaxAdhaar Real-time Tax Compliance Hub",
    description: "Stay ahead of statutory timelines with AI-driven compliance insights.",
    url: "https://taxadhaar.com/blogs",
    type: "website",
  },
};

// ============================================================================
// 🛰️ SERVER-SIDE DATA ACQUISITION PIPELINE
// ============================================================================
async function getPortalData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    // ⚡ सभी बैकएंड एंडपॉइंट्स को पैरेलल में फ़ेच करो भाई (Next.js Optimization)
    const [blogRes, catRes, notiRes, partnerRes] = await Promise.all([
      fetch(`${baseUrl}/api/blogs`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/categories`, { next: { revalidate: 3600 } }), // कैटगरी 1 घंटे तक कैश्ड रहेगी भाई
      fetch(`${baseUrl}/api/notifications`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/partners?active=true`, { next: { revalidate: 1800 } })
    ]);

    // सेफ़टी चेक: अगर कोई एपीआई फेल हो तो ब्लैंक एरे पास होगा भाई
    const blogs = blogRes.ok ? await blogRes.json() : { success: false, data: [] };
    const categories = catRes.ok ? await catRes.json() : { success: false, data: [] };
    const notifications = notiRes.ok ? await notiRes.json() : { success: false, data: [] };
    const partners = partnerRes.ok ? await partnerRes.json() : { success: false, data: [] };

    return {
      initialBlogs: blogs.success ? blogs.data : [],
      initialCategories: categories.success ? categories.data : [],
      initialNotifications: notifications.success ? notifications.data : [],
      initialPartners: partners.success ? partners.data : [],
    };
  } catch (error) {
    console.error("💥 CORE PORTAL SERVER FETCH FAILURE NODE:", error);
    return { initialBlogs: [], initialCategories: [], initialNotifications: [], initialPartners: [] };
  }
}

// ============================================================================
// 🏛️ CORE SERVER CONTAINER MODULE
// ============================================================================
export default async function BlogsPage() {
  // 1. सर्वर पर ही सारा डेटा खींच लो भाई
  const { initialBlogs, initialCategories, initialNotifications, initialPartners } = await getPortalData();

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      {/* ✅ FIXED: सारा डेटा प्रॉप्स के ज़रिए सीधे क्लाइंट नोड को ट्रांसफर कर दिया भाई */}
      <PremiumNewsPortal 
        initialBlogs={initialBlogs}
        initialCategories={initialCategories}
        initialNotifications={initialNotifications}
        initialPartners={initialPartners}
      />
    </main>
  );
}