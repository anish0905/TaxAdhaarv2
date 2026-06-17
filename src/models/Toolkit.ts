import mongoose, { Schema, model, models, Document } from "mongoose";

// --- TYPESCRIPT INTERFACE WITH SEO FIELDS ---
export interface IToolkitProduct extends Document {
  title: string;
  slug: string; // 🔗 SEO Friendly URL के लिए (e.g., "best-finance-books-2026")
  description: string;
  badgeText: string; // e.g., "Best Seller", "4.8 ★"
  affiliateLink: string;
  image: string; // प्रोडक्ट की इमेज का URL
  category: mongoose.Types.ObjectId; // पहले से बनी Category स्कीमा से लिंकिंग 🔗
  
  // 🚀 TIGHT SEO FIELDS
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string; // Comma separated long-tail keywords
  
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ToolkitProductSchema = new Schema<IToolkitProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true }, // URL Router के लिए मस्ट है
    description: { type: String, required: true },
    badgeText: { type: String, default: "Amazon" },
    affiliateLink: { type: String, required: true, trim: true },
    image: { type: String, required: true }, 
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, 
    
    // 🚀 Advanced SEO Payload
    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },
    keywords: { type: String, default: "" }, 

    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔍 PERFORMANCE INDEXING: ताकि जब हज़ारों प्रोडक्ट्स हों, तो भी फ़िल्टर और क्वेरी 1ms में चले
ToolkitProductSchema.index({ category: 1, isActive: 1, displayOrder: 1 });
ToolkitProductSchema.index({ slug: 1 }); 

export const ToolkitProduct = models.ToolkitProduct || model<IToolkitProduct>("ToolkitProduct", ToolkitProductSchema);