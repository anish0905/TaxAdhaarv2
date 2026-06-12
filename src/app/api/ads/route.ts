import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import { AdPlacement } from "../../../models/AdPlacement";

// 1. GET ALL AD PLACEMENTS (फ्रंटएंड पर एड्स दिखाने के लिए)
export async function GET() {
  try {
    await connectDB();
    const ads = await AdPlacement.find({});
    return NextResponse.json({ success: true, data: ads }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. UPSERT AD PLACEMENT (एडमिन पैनल से एड्स अपडेट या क्रिएट करने के लिए)
export async function POST(request: Request) {
  try {
    await connectDB();
    const { location, adCode, isActive } = await request.json();

    if (!location || !adCode) {
      return NextResponse.json({ success: false, message: "Location and AdCode are required" }, { status: 400 });
    }

    // Mongoose में प्रिज्मा की तरह Upsert (ढूंढो, मिले तो अपडेट करो, नहीं तो नया बनाओ)
    const ad = await AdPlacement.findOneAndUpdate(
      { location }, // इस लोकेशन से ढूंढेगा (e.g., "HOME_TOP")
      { adCode, isActive: isActive ?? true }, // ये डेटा अपडेट करेगा
      { new: true, upsert: true } // upsert: true नए डेटा क्रिएशन को हैंडल करता है
    );

    return NextResponse.json({ success: true, data: ad }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}