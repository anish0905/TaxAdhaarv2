import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { DigitalAsset } from "@/models/DigitalAsset";
import { getServerSession } from "next-auth/next";
// authOptions का जो भी तुम्हारा पाथ हो भाई, उसके हिसाब से इम्पोर्ट एडजस्ट कर लेना
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

// ============================================================================
// 📊 1. GET ROUTE: FETCH ALL ASSETS (Frontend Dynamic Grid Pipeline)
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // URL से क्वेरी पैरामीटर्स निकालो भाई (e.g., ?slug=excel-tax-sheet या ?type=excel)
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");

    // अगर कोई स्पेसिफिक स्लग मांगा है, तो सिंगल प्रोडक्ट दो भाई
    if (slug) {
      const asset = await DigitalAsset.findOne({ slug: slug.toLowerCase().trim(), isActive: true });
      if (!asset) {
        return NextResponse.json({ success: false, message: "Asset Node not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: asset }, { status: 200 });
    }

    // फ़िल्टर ऑब्जेक्ट तैयार करो भाई
    let filterQuery: any = { isActive: true };
    if (type) filterQuery.assetType = type.toLowerCase();

    // सारे एक्टिव टूल्स और टेम्पलेट्स को सॉर्ट करके निकालो (Latest First)
    const assets = await DigitalAsset.find(filterQuery).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: assets.length, data: assets }, { status: 200 });
  } catch (error: any) {
    console.error("❌ GET ASSETS ERROR LOOP:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================================
// 🔐 2. POST ROUTE: CREATE NEW DIGITAL ASSET (Admin Secured Gateway)
// ============================================================================
export async function POST(req: NextRequest) {
  try {
    // 🛡️ SECURITY LAYER: पहले चेक करो कि यूजर लॉग्ड इन है या नहीं
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, message: "Unauthorized Operational Request" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const { 
      title, 
      slug, 
      excerpt, 
      description, 
      badgeText, 
      assetType, 
      isPremium, 
      price, 
      fileUrl,
      metaTitle,
      metaDesc 
    } = body;

    // बेसिक वैलिडेशन चेक मारो भाई
    if (!title || !slug || !excerpt || !description || !assetType || !fileUrl) {
      return NextResponse.json({ success: false, message: "Missing mandatory metadata parameters" }, { status: 400 });
    }

    // चेक करो कि इस स्लग का एसेट पहले से तो नहीं है भाई
    const exactSlugCheck = await DigitalAsset.findOne({ slug: slug.toLowerCase().trim() });
    if (exactSlugCheck) {
      return NextResponse.json({ success: false, message: "Slug variation already registered in database schema" }, { status: 400 });
    }

    // नया डिजिटल एसेट नोड तैयार करो
    const newAsset = await DigitalAsset.create({
      title,
      slug: slug.toLowerCase().trim(),
      excerpt,
      description,
      badgeText: badgeText || "CA Vetted",
      assetType: assetType.toLowerCase(),
      isPremium: isPremium !== undefined ? isPremium : true,
      price: price ? Number(price) : 99,
      fileUrl,
      metaTitle: metaTitle || `${title} | TaxAdhaar Tools`,
      metaDesc: metaDesc || excerpt,
    });

    return NextResponse.json({ success: true, message: "Digital Asset Node compiled successfully", data: newAsset }, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST ASSETS ERROR LOOP:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}