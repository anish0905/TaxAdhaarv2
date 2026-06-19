import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import { Category } from "../../../models/blogs";

const slugify = (text: string) => {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
};

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    
    // 💥 फ़िक्स: फ्रंटएंड पेलोड से images एरे को भी यहाँ गेट करो भाई
    const { name, description, images } = await request.json();

    // बेसिक नेम वैलीडेशन
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" }, 
        { status: 400 }
      );
    }

    // 🔒 सेफ़्टी चेक: अगर फ्रंटएंड से images न आए या खाली हो, तो मोंगोज़ एरर से बचने के लिए एरे चेक करो
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Category validation failed: At least one image node is required matrix!" }, 
        { status: 400 }
      );
    }

    // स्लग जेनरेट करो (lower: true रखना बेस्ट रहता है एसईओ के लिए)
    const slug = slugify(name, { lower: true, strict: true });

    // 🚀 अब images भी डेटाबेस क्रिएशन मैट्रिक्स में पास हो जाएगा
    const newCategory = await Category.create({ 
      name, 
      slug, 
      description: description || "", 
      images // 👈 क्लाउडिनरी यूआरएल का एरे यहाँ स्टोर होगा
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    console.error("Category Creation API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}