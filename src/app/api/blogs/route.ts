import { NextResponse } from "next/server";
import connectDB  from "@/lib/db";
import { Blog } from "../../../models/blogs";

const slugify = (text: string) => {
  return text.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
};

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";

    const filter = isAdmin ? {} : { isPublished: true };
    const blogs = await Blog.find(filter).populate("category").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: blogs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, content, excerpt, mainImage, categoryId, metaTitle, metaDesc, keywords, tags, isPublished, showAds } = body;

    if (!title || !content || !excerpt || !mainImage || !categoryId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    const newBlog = await Blog.create({
      title,
      slug,
      content,
      excerpt,
      mainImage,
      category: categoryId,
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt,
      keywords: keywords || tags,
      tags,
      isPublished: isPublished !== undefined ? isPublished : true,
      showAds: showAds !== undefined ? showAds : true
    });

    return NextResponse.json({ success: true, data: newBlog }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}