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
    const { name, description } = await request.json();

    if (!name) return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 });

    const slug = slugify(name);
    const newCategory = await Category.create({ name, slug, description });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}