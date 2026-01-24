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
    
    // --- ROLE LOGIC ---
    // Agar formData me role bhej rahe ho (jaise marketing register page se), to wo lega.
    // Warna default 'client' set karega.
    const requestedRole = formData.get("role") as string;
    const finalRole = ['admin', 'sales', 'staff', 'client', 'field_marketing'].includes(requestedRole) 
      ? requestedRole 
      : "client";

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

      // Existing user update logic
      existingUser.name = name;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      existingUser.referredBy = referredBy || undefined; 
      existingUser.role = finalRole; // Role update
      await existingUser.save();
      
      await sendOTPEmail(email, otp);
      return { success: "OTP sent again!", email };
    }

    // --- NEW USER CREATION ---
    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: finalRole, // Admin, Staff, Client, ya Field Marketing
      otp,
      otpExpires,
      isVerified: false,
      referredBy: referredBy || undefined, 
      referralCode: myNewReferralCode,
      referralEarnings: { balance: 0, pending: 0 }
    });

    // --- REFERRAL PENDING REWARD (₹100) ---
    // Agar referredBy code present hai, to referrer ke pending balance me ₹100 add karein
    if (referredBy) {
      await User.findOneAndUpdate(
        { referralCode: referredBy },
        { $inc: { "referralEarnings.pending": 100 } }
      );
    }

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