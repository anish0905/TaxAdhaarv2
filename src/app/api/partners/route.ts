import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db"; 
import mongoose from "mongoose";
// 🤝 मास्टर फ़ाइल को इम्पोर्ट करें ताकि सारे स्कीमा मोंगुज़ रजिस्ट्री में लोड हो जाएं
import { Partner } from "@/models/blogs"; 

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // ========================================================================
    // 🛡️ RE-COMPILATION SAFEGUARD ENGINE
    // ========================================================================
    // अगर सर्वर कैशे या हॉट-रीलोड के कारण मॉडल रजिस्ट्री मिसमैच हो, तो यह उसे सीधे सिंक रखेगा
    const PartnerModel = mongoose.models.Partner || Partner;

    const url = new URL(req.url);
    const onlyActive = url.searchParams.get("active") === "true";
    
    const filter = onlyActive ? { isActive: true } : {};
    
    // 🚀 डेटाबेस से फ्रेश एक्टिव पार्टनर्स निकालें
    const data = await PartnerModel.find(filter).sort({ displayOrder: 1 });
    
    // सर्वर कंसोल में चेक करें कि डेटाबेस से कितने पार्टनर मिले
    console.log(`📡 Partners API Hits: Found ${data?.length || 0} active monetization links.`);
    
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error("❌ CRITICAL GET PARTNERS ROUTE ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST API: एडमिन पैनल से नया अफ़िलिएट पार्टनर ऐड करना
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    const { name, description, badgeText, affiliateLink, themeColor, displayOrder, isActive } = body;
    
    if (!name || !description || !affiliateLink) {
      return NextResponse.json({ success: false, message: "Missing required fields!" }, { status: 400 });
    }
    
    const newPartner = await Partner.create({
      name,
      description,
      badgeText: badgeText || "Free",
      affiliateLink,
      themeColor: themeColor || "orange",
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    return NextResponse.json({ success: true, data: newPartner }, { status: 201 });
  } catch (error: any) {
    console.error("POST PARTNER ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 3. PUT API: एडमिन पैनल से पार्टनर का स्टेटस या पूरा डेटा अपडेट करना
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // 💡 UPGRADE: सिर्फ स्टेटस टॉगल ही नहीं, बल्कि पूरा डेटा अपडेट करने के लिए body को स्प्रेड किया
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Partner ID is required!" }, { status: 400 });
    }
    
    const updatedPartner = await Partner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!updatedPartner) {
      return NextResponse.json({ success: false, message: "Partner not found!" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedPartner }, { status: 200 });
  } catch (error: any) {
    console.error("PUT PARTNER ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 4. DELETE API: एडमिन पैनल से पुराने पार्टनर को परमानेंट डिलीट करना
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ success: false, message: "Partner ID is required!" }, { status: 400 });
    }
    
    const deletedPartner = await Partner.findByIdAndDelete(id);
    
    if (!deletedPartner) {
      return NextResponse.json({ success: false, message: "Partner not found!" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Partner network deleted successfully!" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE PARTNER ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}