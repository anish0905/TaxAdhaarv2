"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
// --- YEH TYPE ADD KAREIN AUR EXPORT KAREIN ---
export type UploadLeadsState = {
  success?: string;
  error?: string;
};

export async function createEnquiry(formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const service = formData.get("service") as string;

    if (!name || !phone) {
      return { error: "Name and Phone are required!" };
    }

    await Order.create({
      clientName: name,
      clientPhone: phone,
      serviceType: service,
      leadStatus: "pending",
      status: "new_lead",
      salesRemarks: "Website Enquiry",
    });

    revalidatePath("/admin/all-leads");
    return { success: "Humari team aapse jald hi sampark karegi!" };
  } catch (error: any) {
    console.error("Enquiry Error:", error.message);
    return { error: "Something went wrong. Please try again." };
  }
}
