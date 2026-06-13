import { NextResponse } from "next/server";
import connectDB  from "@/lib/db"; // अपना सही मोंगोडीबी कनेक्शन पाथ सुनिश्चित करें
import { Blog } from "@/models/blogs"; // अपनी मॉडल फाइल का सही पाथ सुनिश्चित करें

// 🔒 सुरक्षा के लिए एक मजबूत सीक्रेट की तय करें (इसे आप .env फ़ाइल में भी रख सकते हैं)
const AI_SECRET_KEY = process.env.AI_SECRET_KEY || "AimGrit_AutoPilot_Sec_2026_x7R9bW";

// 📝 हिंदी और इंग्लिश दोनों टाइटल्स के लिए SEO-फ्रेंडली यूनीक स्लग जनरेटर
const generateSlug = (titleStr: string) => {
  const baseSlug = titleStr
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0900-\u097F]+/g, "-") // इंग्लिश नंबर और हिंदी अक्षरों को छोड़कर बाकी सब '-' में बदलेगा
    .replace(/(^-|-$)+/g, ""); // शुरुआत और अंत से एक्स्ट्रा '-' हटाएगा

  // स्लग हमेशा Unique रहे और Mongoose में 'unique: true' एरर न आए, इसलिए पीछे रैंडम स्ट्रिंग जोड़ना
  const uniqueSuffix = Math.random().toString(36).substring(2, 7);
  return `${baseSlug}-${uniqueSuffix}`;
};

export async function POST(req: Request) {
  try {
    // 1. डेटाबेस कनेक्ट करें
    await connectDB();
    
    // 2. रिक्वेस्ट बॉडी रीड करें
    const body = await req.json();

    const {
      secretKey,
      title,
      content,
      excerpt,
      mainImage,
      categoryId, // डैशबोर्ड या AI द्वारा भेजी गई कैटेगरी आईडी
      metaTitle,
      metaDesc,
      keywords,
      tags,
      isPublished,
      showAds,
      isScheduled,
      scheduledTime
    } = body;

    // 🔒 3. सिक्योरिटी चेक (Authorization)
    if (!secretKey || secretKey !== AI_SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "अनाधिकृत एक्सेस! सीक्रेट की (Secret Key) गलत या अनुपस्थित है।" },
        { status: 401 }
      );
    }

    // 🚨 4. मैंडेटरी फ़ील्ड्स की वैलिडेशन
    if (!title || !content || !excerpt || !mainImage || !categoryId) {
      return NextResponse.json(
        { success: false, message: "❌ एरर: title, content, excerpt, mainImage, और categoryId अनिवार्य हैं!" },
        { status: 400 }
      );
    }

    // ⏰ 5. ऑटो-पायलट शेड्यूलिंग लॉजिक
    // अगर पोस्ट को भविष्य के लिए शेड्यूल किया जा रहा है, तो वह तुरंत लाइव (isPublished) नहीं होगी
    const finalIsPublished = isScheduled ? false : (isPublished !== undefined ? isPublished : true);

    // 🔗 6. यूनीक स्लग जनरेट करें
    const blogSlug = generateSlug(title);

    // 📝 7. आपके अपडेटेड स्कीमा के अनुसार डेटाबेस में ब्लॉग एंट्री क्रिएट करें
    const newBlog = await Blog.create({
      title,
      slug: blogSlug,
      content,
      excerpt,
      mainImage,
      category: categoryId, // आपके स्कीमा में 'category: ObjectId' है
      metaTitle: metaTitle || title,
      metaDesc: metaDesc || excerpt,
      keywords: keywords || "",
      tags: tags || "",
      isPublished: finalIsPublished,
      showAds: showAds !== undefined ? showAds : true,
      views: 0, // नया ब्लॉग है तो व्यूज डिफ़ॉल्ट 0
      isScheduled: isScheduled || false,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
    });

    // 8. सफलता का रिस्पांस भेजें
    return NextResponse.json({
      success: true,
      message: isScheduled 
        ? "⏰ ब्लॉग को सफलतापूर्वक आपके टाइमर कतार (Auto-Pilot Queue) में शेड्यूल कर दिया गया है!" 
        : "🚀 ब्लॉग को तुरंत लाइव (LIVE) कर दिया गया है!",
      blogId: newBlog._id,
      slug: blogSlug
    });

  } catch (error: any) {
    console.error("AI Broadcast Routing Error:", error);
    return NextResponse.json(
      { success: false, message: "सर्वर एरर आया: " + error.message },
      { status: 500 }
    );
  }
}