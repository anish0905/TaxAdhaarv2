"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    await connectDB();

    const name = formData.get("name");
    const phone = formData.get("phone");
    const location = formData.get("location");

    await User.findByIdAndUpdate(session.user.id, {
      name,
      phone,
      location,
    });

    // Profile page ka data refresh karne ke liye
    revalidatePath("/dashboard/client/profile");
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Update failed" };
  }
}