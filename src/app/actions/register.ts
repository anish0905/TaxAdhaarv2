"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mail";



export async function registerUser(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const email = (formData.get("email") as string).toLowerCase();
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser) {
      // RULE: Agar verified hai toh hi error do
      if (existingUser.isVerified) {
        return { error: "Email already registered. Please login." };
      }

      // RULE: Agar verified nahi hai, toh purane record ko update kar do (Upsert logic)
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
      
      await sendOTPEmail(email, otp);
      return { success: "New OTP sent to your email!", email };
    }

    // 2. Naya user create karein agar pehle se nahi hai
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "client",
      otp,
      otpExpires,
      isVerified: false,
    });

    await sendOTPEmail(email, otp);
    return { success: "OTP sent to your email!", email };

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
// Ek naya action OTP verify karne ke liye
export async function verifyOTP(email: string, otp: string) {
  await connectDB();
  const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });

  if (!user) return { error: "Invalid or expired OTP" };

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return { success: "Account verified successfully!" };
}