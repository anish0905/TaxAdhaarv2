// /app/actions/createEnquiry.ts
"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export type CreateEnquiryState = {
  success?: string;
  error?: string;
};

export async function createEnquiry(
  formData: FormData
): Promise<CreateEnquiryState> {
  try {
    await connectDB();

    const name = formData.get("name") as string | null;
    const phone = formData.get("phone") as string | null;
    const service = formData.get("service") as string | null;

    if (!name || !phone || !service) {
      return { error: "Name, Phone and Service are required!" };
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
    console.error("Enquiry Error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
