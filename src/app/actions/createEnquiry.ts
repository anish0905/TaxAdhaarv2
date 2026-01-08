"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function createEnquiry(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;

    if (!name || !phone) {
      return { error: "Name and Phone are required!" };
    }

    // Nayi lead banayein
    await Order.create({
      clientName: name,
      clientPhone: phone,
      serviceType: service,
      leadStatus: 'pending', // Shuruat mein pending rahegi
      status: 'new_lead',
      salesRemarks: "Website Enquiry", // Pata chale ki website se aayi hai
    });

    revalidatePath("/admin/all-leads");
    return { success: "Humari team aapse jald hi sampark karegi!" };
  } catch (error: any) {
    console.error("Enquiry Error:", error.message);
    return { error: "Something went wrong. Please try again." };
  }
}