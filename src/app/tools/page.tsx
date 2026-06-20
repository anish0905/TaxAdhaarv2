import { Metadata } from "next";
import connectDB from "@/lib/db";
import { DigitalAsset } from "@/models/DigitalAsset";
import ToolsListClient from "./ToolsListClient";

// ============================================================================
// 🌐 1. PROGRAMMATIC SEO MATRIX FOR DIGITAL STORE
// ============================================================================
export const metadata: Metadata = {
  title: "Premium Finance Tools & Tax Templates Store | TaxAdhaar",
  description: "Download verified professional automation Excel sheets, CA-vetted tax notice reply templates, and audited legal forms ready for FY 2026-27.",
  keywords: "tax excel sheets download, tax notice reply docx template, ca compliance format store, taxadhaar tools aimgrit",
};

// ============================================================================
// 🏛️ 2. SERVER COMPONENT (Fetches Raw DB Node Fast)
// ============================================================================
export default async function FinanceToolsStorePage() {
  await connectDB();
  
  // मोंगोडीबी से सारे एक्टिव एसेट्स एक बार में खींच लो भाई (Server Side Performance)
  const rawAssets = await DigitalAsset.find({ isActive: true }).sort({ createdAt: -1 });
  
  // Client component को पास करने के लिए डेटा को Plain Object में पार्स करो भाई
  const assets = JSON.parse(JSON.stringify(rawAssets));

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-slate-950 font-sans antialiased tracking-tight relative pb-24">
      {/* Dynamic Client Shell handles filters and interactive payment gateways */}
      <ToolsListClient initialAssets={assets} />
    </main>
  );
}