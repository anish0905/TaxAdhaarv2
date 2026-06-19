import mongoose, { Schema, model, models, Document } from "mongoose";

// ==========================================
// 1. TYPESCRIPT INTERFACE (WITH SEO FIELDS)
// ==========================================
export interface IToolkitProduct extends Document {
  title: string;
  slug: string;        // 🔗 SEO Friendly URL (e.g., "taxmann-gst-ready-reckoner-latest")
  description: string; // HTML-supported rich text payload
  badgeText: string;   // e.g., "Best Seller", "4.9 ★ | CA Vetted"
  affiliateLink: string;
  image: string;       // Cloudinary Image URL (Enforces at least one node)
  category: mongoose.Types.ObjectId; // Category स्कीमा से लिंकिंग 🔗
  
  // 🚀 ADVANCED PROGRAMMATIC SEO FIELDS
  metaTitle?: string;
  metaDesc?: string;
  keywords?: string;   // Comma separated long-tail keywords (e.g., "gst book, taxmann 2026")
  
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 2. MONGOOSE SCHEMA CONFIGURATION
// ==========================================
const ToolkitProductSchema = new Schema<IToolkitProduct>(
  {
    title: { 
      type: String, 
      required: [true, "Product title is strictly required!"], 
      trim: true 
    },
    slug: { 
      type: String, 
      required: [true, "SEO Router Slug is required for dynamic routing!"], 
      unique: true, 
      trim: true,
      lowercase: true // ⚙️ URL को हमेशा lowercase में रखने के लिए आर्किटेक्चरल सेफ़गार्ड
    },
    description: { 
      type: String, 
      required: [true, "Product HTML description payload is required!"] 
    },
    badgeText: { 
      type: String, 
      default: "Amazon",
      trim: true
    },
    affiliateLink: { 
      type: String, 
      required: [true, "SiteStripe Affiliate Hook Link is mandatory!"], 
      trim: true 
    },
    image: { 
      type: String, 
      required: [true, "At least one image node is required matrix!"], // 🔥 तुम्हारी इमेज वाली एरर का परमानेंट फ़िक्स
      trim: true 
    }, 
    category: { 
      type: Schema.Types.ObjectId, 
      ref: "Category", 
      required: [true, "Product must be linked to a target Department Category Topic!"] 
    }, 
    
    // 🚀 Advanced Programmatic SEO Payload
    metaTitle: { 
      type: String, 
      default: "", 
      trim: true 
    },
    metaDesc: { 
      type: String, 
      default: "", 
      trim: true 
    },
    keywords: { 
      type: String, 
      default: "", 
      trim: true // फ्रंटएंड पर इसे easily .split(",") करके टैग्स बना सकते हो भाई
    }, 

    displayOrder: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { 
    timestamps: true // Automated createdAt और updatedAt मैनेजमेंट के लिए
  }
);

// ==========================================
// 3. HIGH-PERFORMANCE CLOUD INDEXING
// ==========================================
// ⚡ COMPOUND INDEX: जब यूजर फ्रंटएंड पर किसी विशिष्ट कैटेगरी पर फ़िल्टर मारेगा, तो 1ms में सॉर्टेड डेटा लोड होगा
ToolkitProductSchema.index({ category: 1, isActive: 1, displayOrder: 1 });

// 🔗 SINGLE INDEX: डायनेमिक राउट `/toolkit/[slug]` पर findOne lookups को सुपरफास्ट बनाने के लिए
ToolkitProductSchema.index({ slug: 1 }); 

// ==========================================
// 4. EXPORT MATRIX NODE
// ==========================================
export const ToolkitProduct = models.ToolkitProduct || model<IToolkitProduct>("ToolkitProduct", ToolkitProductSchema);