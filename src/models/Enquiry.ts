import mongoose, { Schema, model, models } from "mongoose";

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { 
      type: String, 
      required: true,
      enum: ["Income Tax (ITR) Filing", "GST Registration & Returns", "TDS & Compliance", "PAN Card Services", "Digital Signature (DSC)", "Other Tax Queries"]
    },
    message: { type: String, trim: true },
    status: { 
      type: String, 
      default: "pending", 
      enum: ["pending", "contacted", "converted", "closed"] 
    },
    source: { type: String, default: "Support Page" }
  },
  { timestamps: true }
);

export const Enquiry = models.Enquiry || model("Enquiry", EnquirySchema);