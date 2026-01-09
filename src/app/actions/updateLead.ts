// /app/actions/updateLead.ts
"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export type UpdateLeadState = {
  success?: string;
  error?: string;
};

export async function updateLeadDetails(formData: FormData): Promise<UpdateLeadState> {
  try {
    await connectDB();

    const leadId = formData.get("leadId") as string;
    const clientName = formData.get("clientName") as string;
    const clientPhone = formData.get("clientPhone") as string;
    const serviceType = formData.get("serviceType") as string;

    if (!leadId) return { error: "Lead ID is required" };

    await Order.updateOne(
      { _id: leadId },
      {
        $set: { clientName, clientPhone, serviceType },
      }
    );

    revalidatePath("/sales"); // Update page cache

    return { success: "Lead updated successfully!" };
  } catch (err: any) {
    return { error: err.message || "Failed to update lead." };
  }
}
