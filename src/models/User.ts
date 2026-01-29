import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: String,
resetPasswordExpiry: Date,
  role: { 
    type: String, 
    enum: ['admin', 'sales', 'staff', 'client','field_marketing'], 
    default: 'client' 
  },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },

//referral system fields
  referralCode: { type: String, unique: true },
referredBy: { type: String }, // Jisne invite kiya uska code
referralEarnings: {
  balance: { type: Number, default: 0 }, // Active balance
  pending: { type: Number, default: 0 },  // Unactive balance (pending first order)
// Naya field: Lifetime kitna kamaya marketing se
    totalCommissionEarned: { type: Number, default: 0 }
},
  createdAt: { type: Date, default: Date.now }
});

// TTL Index: Jo users verified nahi hain, wo 24 ghante baad auto-delete ho jayenge
UserSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 86400, 
  partialFilterExpression: { isVerified: false } 
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);