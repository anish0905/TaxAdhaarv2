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
    const referredBy = formData.get("referredBy") as string; 

    const existingUser = await User.findOne({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Unique Referral Code generate karein
    const myNewReferralCode = name.split(' ')[0].toUpperCase() + Math.floor(1000 + Math.random() * 9000);

    if (existingUser) {
      if (existingUser.isVerified) {
        return { error: "Email already registered. Please login." };
      }

      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.referredBy = referredBy || undefined; 
      await existingUser.save();
      
      await sendOTPEmail(email, otp);
      return { success: "OTP sent again!", email };
    }

    // Naya user create karein
    // Note: Yahan balance update nahi karenge, verifyOTP mein karenge.
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "client",
      otp,
      otpExpires,
      isVerified: false,
      referredBy: referredBy || undefined, 
      referralCode: myNewReferralCode,
      referralEarnings: { balance: 0, pending: 0 }
    });

    await sendOTPEmail(email, otp);
    return { success: "OTP sent to your email!", email };

  } catch (error) {
    console.error("Registration Error:", error);
    return { error: "Something went wrong." };
  }
}

export async function verifyOTP(email: string, otp: string) {
  try {
    await connectDB();
    
    // Check user and OTP expiry
    const user = await User.findOne({ 
      email: email.toLowerCase(), 
      otp, 
      otpExpires: { $gt: new Date() } 
    });

    if (!user) return { error: "Invalid or expired OTP" };

    // --- REFERRAL LOGIC START ---
    // Hum sirf tabhi update karenge jab user pehli baar verify ho raha ho
    if (!user.isVerified && user.referredBy) {
      const trimmedRefCode = user.referredBy.trim();
      
      const updateReferrer = await User.findOneAndUpdate(
        { referralCode: trimmedRefCode },
        { $inc: { "referralEarnings.pending": 100 } },
        { new: true }
      );
      
      if (updateReferrer) {
        console.log(`✅ Success: ₹100 Pending added to ${trimmedRefCode}`);
      } else {
        console.log(`❌ Error: Referrer code ${trimmedRefCode} not found in DB`);
      }
    }
    // --- REFERRAL LOGIC END ---

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { success: "Verified!" };
  } catch (e) { 
    console.error("OTP Error:", e);
    return { error: "Verification Failed" }; 
  }
}