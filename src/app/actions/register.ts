"use server"
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string; // admin, sales, staff, client

    // 1. Check karo user pehle se toh nahi hai
    const userExists = await User.findOne({ email });
    if (userExists) {
      return { error: "Email pehle se registered hai!" };
    }

    // 2. Password ko hash (encrypt) karo
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Database mein save karo
    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role:"client",
    });

    return { success: "Registration safal raha!", user: JSON.parse(JSON.stringify(newUser)) };
  } catch (error) {
    console.error(error);
    return { error: "Kuch galti hui hai." };
  }
}