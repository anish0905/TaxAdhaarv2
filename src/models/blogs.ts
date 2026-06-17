import mongoose, { Schema, model, models, Document } from "mongoose";

// --- TYPESCRIPT INTERFACES (For Next.js Type Safety) ---
export interface ICategory extends Document {
  name: string;
  slug: string;
  images: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartner extends Document {
  name: string;
  description: string;
  badgeText: string;
  affiliateLink: string;
  themeColor: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  mainImage: string;
  category: mongoose.Types.ObjectId | ICategory;
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;
  tags?: string;
  isPublished: boolean;
  showAds: boolean;
  views: number;
  relatedPartners: mongoose.Types.ObjectId[] | IPartner[]; // 🤝 DYNAMIC MARKETING AFFILIATE INTEGRATION
  isScheduled: boolean;
  scheduledTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotification extends Document {
  title: string;
  link?: string;
  isUrgent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 1. CATEGORY SCHEMA
// ==========================================
const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
images: { 
      type: [String], 
      required: true,
      validate: [
        (val: string[]) => val.length > 0, 
        "At least one image node is required matrix!"
      ] 
    }, 
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Category = models.Category || model<ICategory>("Category", CategorySchema);

// ==========================================
// 2. PARTNER SCHEMA (अफ़िलिएट नेटवर्क्स ट्रैकर 🤝)
// ==========================================
const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    badgeText: { type: String, default: "Free" },
    affiliateLink: { type: String, required: true, trim: true },
    themeColor: { type: String, default: "orange" }, 
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Partner = models.Partner || model<IPartner>("Partner", PartnerSchema);

// ==========================================
// 3. BLOG SCHEMA (टैक्स पोर्टल न्यूज़, SEO बूस्टर + ऑटो-पायलट + अफ़िलिएट मैपिंग)
// ==========================================
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true }, // 💡 unique: true यहाँ पहले से ही इंडेक्स बना रहा है!
    content: { type: String, required: true }, 
    excerpt: { type: String, required: true, trim: true }, 
    mainImage: { type: String, required: true }, 
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    // SEO Meta Data
    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },
    keywords: { type: String, default: "" }, 
    tags: { type: String, default: "" }, 

    // Controls
    isPublished: { type: Boolean, default: true },
    showAds: { type: Boolean, default: true }, 
    views: { type: Number, default: 0 }, 

    // 🤝 dynamic affiliate mapping
    relatedPartners: [{ type: Schema.Types.ObjectId, ref: "Partner" }],

    // ⏰ AI Auto-Pilot Engine Fields
    isScheduled: { type: Boolean, default: false }, 
    scheduledTime: { type: Date, default: null }, 
  },
  { timestamps: true }
);

// Search Optimization for fast indexing
// 💡 FIX: यहाँ से 'slug: 1' वाला डुप्लिकेट इंडेक्स हटा दिया है क्योंकि वो ऊपर 'unique: true' से मैनेज हो रहा है।
BlogSchema.index({ isScheduled: 1, isPublished: 1, scheduledTime: 1 }); // क्रॉन जॉब की परफॉरमेंस के लिए कंपाउंड इंडेक्स

export const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);

// ==========================================
// 4. LIVE NOTIFICATION SCHEMA
// ==========================================
const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true }, 
    link: { type: String, default: "" }, 
    isUrgent: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

export const Notification = models.Notification || model<INotification>("Notification", NotificationSchema);