import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Category } from "../../../models/blogs";

// 🛠️ तुम्हारा कस्टम स्लग जनरेटर फ़ंक्शन (यह केवल 1 आर्गुमेंट स्वीकार करता है)
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // स्पेस को हाइफन में बदलें
    .replace(/[^\w\-]+/g, "")   // स्पेशल कैरेक्टर साफ करें
    .replace(/\-\-+/g, "-");    // डबल हाइफन हटाएँ
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
    
    // फ्रंटएंड पेलोड से डेटा डिस्ट्रक्चर करें
    const { name, description, images } = await request.json();

    // बेसिक नेम वैलीडेशन
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" }, 
        { status: 400 }
      );
    }

    // इमेज वैलीडेशन सेफ़्गार्ड
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, message: "Category validation failed: At least one image node is required matrix!" }, 
        { status: 400 }
      );
    }

    // 🎯 फ़िक्स: यहाँ से दूसरा आर्गुमेंट हटा दिया भाई, क्योंकि तुम्हारा कस्टम फ़ंक्शन पहले से ही सब लोअरकेस कर देता है!
    const slug = slugify(name);

    // डेटाबेस क्रिएशन मैट्रिक्स
    const newCategory = await Category.create({ 
      name, 
      slug, 
      description: description || "", 
      images 
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