import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import { Blog, Category } from "../../../../models/blogs";
import { Types } from "mongoose";

// 1. GET SINGLE BLOG (Slug या ID दोनों से सेफ़ली फ़ेच करेगा)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // 100% Correct [slug] Match
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; 

    if (!incomingSlug) {
      return NextResponse.json({ success: false, message: "Slug missing" }, { status: 400 });
    }

    const isObjectId = Types.ObjectId.isValid(incomingSlug);
    const queryCondition = isObjectId ? { _id: incomingSlug } : { slug: incomingSlug };

    const blog = await Blog.findOne(queryCondition).populate({
      path: "category",
      model: Category
    });

    if (!blog) {
      return NextResponse.json({ success: false, message: "समाचार नहीं मिला" }, { status: 404 });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    return NextResponse.json({ success: true, data: blog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. UPDATE BLOG (PUT) - Fixes the build error 🚀
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // यहाँ 'id' हटाकर 'slug' कर दिया
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; // 'id' की जगह 'slug'

    const body = await request.json();

    // अगर आ रहा पैरामीटर ObjectId है तो डायरेक्ट अपडेट करें, वरना पहले स्लग से ढूंढें
    const queryCondition = Types.ObjectId.isValid(incomingSlug)
      ? { _id: incomingSlug }
      : { slug: incomingSlug };

    const updatedBlog = await Blog.findOneAndUpdate(queryCondition, body, { new: true });
    return NextResponse.json({ success: true, data: updatedBlog }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. DELETE BLOG (DELETE) - Fixes the build error 🚀
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> } // यहाँ भी 'id' हटाकर 'slug' कर दिया
) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const incomingSlug = resolvedParams.slug; // 'id' की जगह 'slug'

    const queryCondition = Types.ObjectId.isValid(incomingSlug)
      ? { _id: incomingSlug }
      : { slug: incomingSlug };

    await Blog.findOneAndDelete(queryCondition);
    return NextResponse.json({ success: true, message: "News deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}