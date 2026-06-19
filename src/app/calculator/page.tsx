import { Metadata } from "next";
import TaxCalculatorClient from "./TaxCalculatorClient";

// ============================================================================
// 🌐 1. FULL PROGRAMMATIC SEO MATRIX NODES (Google Search Engine Optimization)
// ============================================================================
export const metadata: Metadata = {
  title: "AI Income Tax Calculator FY 2026-27 (AY 2027-28) | TaxAdhaar Precision Optimizer",
  description: "Calculate and compare your tax liabilities under the New vs Old Tax Regime for FY 2026-27. Optimize deductions and generate an instant audited report via TaxAdhaar.",
  keywords: "income tax calculator 2026-27, old vs new tax regime calculator india, taxadhaar salary optimizer, taxmann tools bihar, free itr tax invoice builder aimgrit",
  openGraph: {
    title: "AI Income Tax Calculator FY 2026-27 | TaxAdhaar",
    description: "Precision tax analytics framework to optimize gross annual income parameters natively.",
    type: "website",
    images: [{ url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600" }],
  },
};

// ============================================================================
// 🏛️ 2. STRUCTURED SCHEMA DATA INTERLINK (Google Rich Snippets Core)
// ============================================================================
export default function TaxCalculatorPage() {
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "TaxAdhaar Precision Tax Calculator",
    "description": "Interactive financial tool evaluating Old vs New Indian Income Tax structures for Fiscal Year 2026-27.",
    "applicationCategory": "FinancialApplication",
    "operatingSystem": "All",
    "url": "https://taxadhaar.com/calculator", // 🎯 अपनी लाइव डोमेन यूआरएल से सिंक कर लेना भाई
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "INR"
    }
  };

  return (
    <>
      {/* Structural Schema Injection Layer */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />
      
      {/* Hydrating Interconnected Client Component */}
      <TaxCalculatorClient />
    </>
  );
}