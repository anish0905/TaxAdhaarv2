import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import connectDB from "@/lib/db";
import { DigitalAsset } from "@/models/DigitalAsset";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ============================================================================
// 🪐 GOOGLE DRIVE AUTHENTICATION HUB (Using Service Account Credentials)
// ============================================================================
// ============================================================================
// 🪐 GOOGLE DRIVE AUTHENTICATION HUB (Using Service Account Credentials)
// ============================================================================
const getDriveClient = () => {
  // 🎯 ⚡ FIXED: Parameters को अब एक सिंगल ऑब्जेक्ट के रूप में पास किया गया है
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  
  return google.drive({ version: "v3", auth });
};

// ============================================================================
// 📥 CORE ROUTE: SECURE STREAM DOWNLOAD (Zero Public Leak Pipeline)
// ============================================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const token = searchParams.get("token"); // Razorpay/Webhook verification token

    if (!slug) {
      return NextResponse.json({ success: false, message: "Asset target slug is required" }, { status: 400 });
    }

    await connectDB();

    // 1. डेटाबेस से चेक करो कि एसेट एक्सिस्ट करता है या नहीं
    const asset = await DigitalAsset.findOne({ slug: slug.toLowerCase().trim(), isActive: true });
    if (!asset) {
      return NextResponse.json({ success: false, message: "Asset node not found" }, { status: 404 });
    }

    // 2. 🛡️ SECURITY VERIFICATION: अगर प्रीमियम है, तो टोकन चेक करो भाई
    if (asset.isPremium) {
      // अभी टेस्टिंग के लिए नॉर्मल चेक रख रहे हैं, बाद में इसे रेज़रपे पेमेंट आईडी से रिप्लेस करेंगे भाई
      if (!token || token !== "PAYMENT_SUCCESS_TOKEN") {
        return NextResponse.json({ success: false, message: "Access Denied: Payment Token Verification Failed" }, { status: 403 });
      }
    }

    // 3. GOOGLE DRIVE PROTOCOL RUNTIME
    const drive = getDriveClient();
    
    // गूगल ड्राइव से सीधे फ़ाइल का रिस्पॉन्स स्ट्रीम (Stream) मँगाओ भाई
    const driveResponse = await drive.files.get(
      { fileId: asset.driveFileId, alt: "media" },
      { responseType: "stream" }
    );

    // 4. GENERATE STREAM RESPONSE HEADERS (यूजर को डायरेक्ट डाउनलोड पॉप-अप देने के लिए)
    const fileExtension = asset.assetType === "excel" ? "xlsx" : asset.assetType === "word" ? "docx" : "pdf";
    const contentType = asset.assetType === "excel" 
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    // डाउनलोड काउंट को +1 कर दो भाई डेटाबेस में
    asset.downloadCount = (asset.downloadCount || 0) + 1;
    await asset.save();

    // वेब-स्ट्रीम के रूप में फ़ाइल को सीधे यूजर के ब्राउज़र पर रिफ्लेक्ट करो भाई
    return new Response(driveResponse.data as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${asset.slug}.${fileExtension}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });

  } catch (error: any) {
    console.error("❌ DRIVE STREAM FAILURE NODE:", error);
    return NextResponse.json({ success: false, message: "Secure transmission crash node", error: error.message }, { status: 500 });
  }
}