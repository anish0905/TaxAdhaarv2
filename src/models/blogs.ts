import mongoose, { Schema, model, models, Document } from "mongoose";

// --- TYPESCRIPT INTERFACES (For Next.js Type Safety) ---
export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
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
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Category = models.Category || model<ICategory>("Category", CategorySchema);

// ==========================================
// 2. BLOG SCHEMA (टैक्स पोर्टल न्यूज़ और SEO बूस्टर)
// ==========================================
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true }, // HTML/Rich Text Content
    excerpt: { type: String, required: true, trim: true }, // Google Search Snippet
    mainImage: { type: String, required: true }, // Cloudinary WebP Image URL
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    // SEO Meta Data
    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },
    keywords: { type: String, default: "" }, // e.g., "ITR due date, GST return filing"
    tags: { type: String, default: "" }, // Internal Tagging

    // Controls
    isPublished: { type: Boolean, default: true },
    showAds: { type: Boolean, default: true }, // Ads control panel
    views: { type: Number, default: 0 }, // Viral Traffic Tracker
  },
  { timestamps: true }
);

// Search Optimization for fast indexing
BlogSchema.index({ slug: 1 });

export const Blog = models.Blog || model<IBlog>("Blog", BlogSchema);

// ==========================================
// 3. LIVE NOTIFICATION SCHEMA (New Feature 🚀)
// ==========================================
const NotificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true, trim: true }, // e.g., "GSTR-9/9C filing deadline extended!"
    link: { type: String, default: "" }, // Circular PDF Link or Internal Blog URL
    isUrgent: { type: Boolean, default: false }, // If true, flashes red on portal
  },
  { timestamps: true }
);

export const Notification = models.Notification || model<INotification>("Notification", NotificationSchema);