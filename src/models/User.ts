import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Auth ke liye
  role: { 
    type: String, 
    enum: ['admin', 'sales', 'staff', 'client'], 
    default: 'client' 
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);