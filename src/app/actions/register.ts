"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/mail";

// actions/register.ts

export async function registerUser(formData: FormData) {
  try {
    await connectDB();
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const phone = formData.get("phone") as string;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // RULE: Agar user verified hai, tabhi "Already exists" bolo
      if (existingUser.isVerified) {
        return { error: "Email pehle se registered aur verified hai!" };
      }
      
      // RULE: Agar user verified NAHI hai, toh purane record ko update karo
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.phone = phone;
      existingUser.otp = otp;
      existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      await existingUser.save();

      await sendOTPEmail(email, otp);
      return { success: "OTP resent! Pehle wala account verify karein.", email };
    }

    // 2. Naya user create karein agar record nahi mila
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name, email, phone,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      isVerified: false,
    });

    await sendOTPEmail(email, otp);
    return { success: "OTP sent to your email!", email };

  } catch (error) {
    return { error: "Registration process fail ho gaya." };
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