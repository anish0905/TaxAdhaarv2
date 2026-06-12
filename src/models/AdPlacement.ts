import mongoose, { Schema, model, models, Document } from "mongoose";

export interface IAdPlacement extends Document {
  location: string; // e.g., "HOME_TOP", "BLOG_SIDEBAR", "BELOW_TITLE"
  adCode: string;   // Google AdSense से मिला हुआ <ins> या स्क्रिप्ट कोड
  isActive: boolean; // ऑन या ऑफ करने के लिए टॉगल
  createdAt: Date;
  updatedAt: Date;
}

const AdPlacementSchema = new Schema<IAdPlacement>(
  {
    location: { type: String, required: true, unique: true, trim: true },
    adCode: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const AdPlacement = models.AdPlacement || model<IAdPlacement>("AdPlacement", AdPlacementSchema);