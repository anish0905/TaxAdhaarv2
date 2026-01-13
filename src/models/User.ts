import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'sales', 'staff', 'client'], 
    default: 'client' 
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// TTL Index: Jo users verified nahi hain, wo 24 ghante baad auto-delete ho jayenge
UserSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 86400, 
  partialFilterExpression: { isVerified: false } 
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);