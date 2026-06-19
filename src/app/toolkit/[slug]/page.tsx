import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ShieldCheck, Star, ArrowUpRight, BookOpen, Layers } from "lucide-react";
import connectDB from "@/lib/db"; 
import { ToolkitProduct } from "@/models/Toolkit"; 
import { redis } from "@/lib/redis";
import PublicNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

// 🚀 1. DYNAMIC METADATA GENERATOR (FSafe Case Alignment)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; 
  await connectDB();
  
  let product = null;
  try {
    const cached = await redis.get(`toolkit:product:${slug.toLowerCase().trim()}`);
    product = cached ? (typeof cached === "string" ? JSON.parse(cached) : cached) : null;
  } catch (e) {
    console.error("SEO cache fetch fault:", e);
  }

  if (!product) {
    product = await ToolkitProduct.findOne({ slug: slug.toLowerCase().trim(), isActive: true });
  }

  if (!product) return { title: "Blueprint Not Found | TaxAdhaar" };

  return {
    title: product.metaTitle || `${product.title} | TaxAdhaar Blueprint`,
    description: product.metaDesc || `Access professional compliance frameworks for ${product.title}. Vetted systematically by TaxAdhaar nodes.`,
    openGraph: {
      title: product.metaTitle || product.title,
      description: product.metaDesc || product.title,
      images: [{ url: product.image }],
    },
  };
}

// 🏛️ 2. CORE SERVER SIDE ROUTE ROUTINE (Fully Mobile Responsive UI Update)
export default async function ToolkitProductPage({ params }: Props) {
  const { slug } = await params; 
  await connectDB();
  let product = null;

  // 🛡️ REDIS PIPELINE READ
  try {
    const cached = await redis.get(`toolkit:product:${slug.toLowerCase().trim()}`);
    if (cached) {
      product = typeof cached === "string" ? JSON.parse(cached) : cached;
    }
  } catch (err) {
    console.error("Redis read error node:", err);
  }

  // Cache MISS -> Fallback to MongoDB Lookups
  if (!product) {
    product = await ToolkitProduct.findOne({ slug: slug.toLowerCase().trim(), isActive: true });
    
    if (product) {
      try {
        await redis.set(`toolkit:product:${slug.toLowerCase().trim()}`, JSON.stringify(product), { ex: 3600 });
      } catch (err) {
        console.error("Redis set error node:", err);
      }
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-[#F8FAFC] min-h-screen text-slate-950 font-sans antialiased tracking-tight">
      <PublicNavbar />
      
      {/* Container Context Node Layout */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 space-y-6 md:space-y-8">
        
        {/* Breadcrumb Back Button */}
        <Link 
          href="/toolkit" 
          className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-all group w-fit"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Ecosystem Store
        </Link>

        {/* 📱 Main Dynamic Layout Grid: Stacked on Mobile (1 col), Split on desktop (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* ======================================================= */}
          {/* 📦 LEFT ZONE: Product Image & Badges Block (Sticky on Desktop) */}
          {/* ======================================================= */}
          <div className="md:col-span-1 bg-white border border-slate-200/80 rounded-[1.8rem] p-4 sm:p-5 shadow-sm md:sticky md:top-28 w-full transition-all">
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner relative group">
              <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
              />
            </div>
            
            {/* Dynamic Badge & Ratings Node */}
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-50 pt-3">
              <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-mono rounded-lg text-[8px] font-black uppercase tracking-widest truncate max-w-[60%]">
                {product.badgeText || "Vetted Blueprint"}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px] sm:text-xs shrink-0">
                <Star size={12} fill="currentColor" className="mb-0.5" /> 4.9 Global Vetted
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 📄 RIGHT ZONE: Title, CTA Button & HTML Description Content */}
          {/* ======================================================= */}
          <div className="md:col-span-2 space-y-5 sm:space-y-6 w-full">
            
            {/* Heading & Meta Wrapper */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[8px] font-black tracking-widest uppercase text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded">
                <BookOpen size={9} /> Resource Core Node
              </span>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-tight">
                {product.title}
              </h1>
            </div>

            {/* 💸 THE PREMIUM CONVERSION AFFILIATE BUTTON (Optimized Mobile Touch Target) */}
            <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="sponsored nofollow"
              className="flex items-center justify-center gap-2.5 w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-950/10 hover:shadow-xl active:scale-[0.99] transition-all duration-300 group"
            >
              <ShoppingCart size={14} className="text-amber-400 group-hover:rotate-3 transition-transform" />
              Access Resource on Amazon <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* DESCRIPTION BODY ZONE: Enforces Responsive Prose Layer */}
            <div className="bg-white border border-slate-200/80 rounded-[1.8rem] p-5 sm:p-6 md:p-8 shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4 sm:mb-5">
                <Layers size={10} /> Operational Content Blueprint Details
              </div>
              
              {/* HTML रीयल-टाइम रेंडरिंग पैड - मोबाइल पर टेबल्स को रिस्पांसिव स्क्रॉल देने के लिए */}
              <div 
                className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed 
                  prose-headings:font-black prose-headings:text-slate-900 prose-headings:uppercase prose-headings:tracking-tight 
                  prose-th:bg-slate-900 prose-th:text-white prose-th:text-[10px] prose-th:font-black prose-th:uppercase prose-th:p-3
                  prose-td:p-3 prose-td:text-xs
                  overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>

            {/* Institutional Security Badge Footer */}
            <div className="flex items-start sm:items-center gap-3 bg-slate-100 border border-slate-200/60 p-4 rounded-2xl text-[10px] font-semibold text-slate-500 leading-relaxed">
              <ShieldCheck size={14} className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                Secure Bridge Active: Validated Amazon SiteStripe ecosystem payload routing rules apply natively.
              </span>
            </div>

          </div>
        </div>
          <a 
              href={product.affiliateLink} 
              target="_blank" 
              rel="sponsored nofollow"
              className="flex items-center justify-center gap-2.5 w-full py-4 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-950/10 hover:shadow-xl active:scale-[0.99] transition-all duration-300 group"
            >
              <ShoppingCart size={14} className="text-amber-400 group-hover:rotate-3 transition-transform" />
              Access Resource on Amazon <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
      </div>
      
      <Footer />
    </main>
  );
}