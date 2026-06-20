import mongoose, { Schema, model, models } from "mongoose";

// डिजिटल एसेट स्कीما (एक्सेल शीट्स और टैक्स नोटिस टेम्पलेट्स के लिए)
const DigitalAssetSchema = new Schema(
  {
    title: { 
      type: String, 
      required: [true, "Asset title is mandatory"], 
      trim: true 
    },
    slug: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    excerpt: { 
      type: String, 
      required: [true, "Short description is required for listings"],
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, "Detailed HTML content description is mandatory"] 
    }, // HTML फॉर्मेट के लिए भाई ताकि यूआई चकाचक दिखे
    badgeText: { 
      type: String, 
      default: "CA Vetted" 
    }, // e.g., "🔥 Top Seller", "Budget 2026 Ready", "Best Utility"
    assetType: { 
      type: String, 
      required: true, 
      enum: ["excel", "word", "pdf"],
      lowercase: true
    }, // फ़ाइल का टाइप आइडेंटिफाई करने के लिए
    isPremium: { 
      type: Boolean, 
      default: true 
    }, // फ्री लीड मैग्नेट है या ₹99 वाला पेड एसेट
    price: { 
      type: Number, 
      default: 99 
    }, // ₹99 या जो भी तुम सेट करो भाई
    fileUrl: { 
      type: String, 
      required: [true, "Secure file storage URL is mandatory"] 
    }, // Cloudinary, AWS S3 या सिक्योर क्लाउड लिंक
    downloadCount: { 
      type: Number, 
      default: 0 
    }, // कितनी बार डाउनलोड हुआ (ट्रैकिंग नोड)
    isActive: { 
      type: Boolean, 
      default: true 
    }, // एक्टिव/इनएक्टिव टॉगल करने के लिए
    
    // 🌐 INTEGRATED PROGRAMMATIC SEO MATRIX
    metaTitle: { 
      type: String, 
      trim: true 
    },
    metaDesc: { 
      type: String, 
      trim: true 
    },
    // fileUrl की जगह सिर्फ Google Drive की ID स्टोर करेंगे भाई
driveFileId: { 
  type: String, 
  required: [true, "Google Drive File ID is mandatory for security"] 
},
  },
  { 
    timestamps: true // इससे createdAt और updatedAt अपने आप मैनेज होगा भाई
  }
);

// इंडेक्सिंग ताकि स्लग से सर्च मारते समय डेटाबेस पर लोड न पड़े और स्पीड रॉकेट रहे
DigitalAssetSchema.index({ slug: 1 });

export const DigitalAsset = models.DigitalAsset || model("DigitalAsset", DigitalAssetSchema);