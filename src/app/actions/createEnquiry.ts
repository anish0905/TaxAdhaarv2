"use server";

import connectDB from "@/lib/db";
import { Enquiry } from "@/models/Enquiry"; // Enquiry model import karein
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
    const message = formData.get("message") as string | null;

    // Basic Validation
    if (!name || !phone || !service) {
      return { error: "Name, Phone and Service are required!" };
    }

    // Creating entry in Enquiry Module
    await Enquiry.create({
      name,
      phone,
      service,
      message: message || "No specific message provided",
      status: "pending",
      source: "TaxAadhaar Support Portal"
    });

    // Revalidate different paths if needed
    revalidatePath("/admin/enquiries"); 
    revalidatePath("/dashboard/client/support");

    // Replace this line in your server action:
return { success: "Our team will contact you shortly!" };
  } catch (error: any) {
    console.error("Enquiry Error:", error);
    return { error: "Service unavailable. Please try again later." };
  }
}