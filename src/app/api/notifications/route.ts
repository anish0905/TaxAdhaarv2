// पुराना हटाओ: import { Notification } from "../../../models/notifications";
// उसकी जगह यह 100% सही पाथ डालो:
import { Notification } from "../../../models/blogs";
import connectDB  from "@/lib/db";
import { NextResponse } from "next/server";

// 1. GET ALL NOTIFICATIONS (For Live Marquee Ticker & Sidebar)
export async function GET() {
  try {
    await connectDB();
    // ताज़ा सर्कुलर सबसे ऊपर दिखेंगे (Limit 10)
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST NEW NOTIFICATION (From Admin Dashboard)
export async function POST(request: Request) {
  try {
    await connectDB();
    const { title, link, isUrgent } = await request.json();

    if (!title) {
      return NextResponse.json({ success: false, message: "Notification title is required" }, { status: 400 });
    }

    const newNotification = await Notification.create({
      title,
      link,
      isUrgent: isUrgent || false,
    });

    return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}