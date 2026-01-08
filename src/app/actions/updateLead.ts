"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function updateLeadDetails(formData: FormData) {
  try {
    await connectDB();
    
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string; // Check modal name="phone"
    const service = formData.get("service") as string;
    const comment = formData.get("comment") as string;
    const status = formData.get("status") as string;

    console.log("Saving Data:", { id, name, phone, status });

    if (!id || !phone) {
      // Agar phone missing hai toh update mat hone do, varna Required validation fail hoga
      return { error: "ID or Phone Number is missing" };
    }

    const updated = await Order.findByIdAndUpdate(id, {
      clientName: name,
      clientPhone: phone,
      serviceType: service,
      salesRemarks: comment,
      leadStatus: status,
      status: status === 'confirmed' ? 'docs_pending' : 'new_lead'
    }, { new: true }); // updated document return karega

    if (!updated) throw new Error("Database mein record nahi mila");

    revalidatePath("/sales");
    return { success: true };
  } catch (error: any) {
    console.error("Mongoose Update Error:", error.message);
    return { error: error.message };
  }
}