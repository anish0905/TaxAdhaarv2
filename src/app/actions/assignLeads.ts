"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function assignLeadsAction(formData: FormData): Promise<void> {
  await connectDB();

  const salesStaffId = formData.get("salesStaffId") as string;
  const leadIds = (formData.getAll("leadIds") as string[]).filter(id => typeof id === "string");

  if (!salesStaffId || leadIds.length === 0) {
    console.warn("No staff or lead IDs provided.");
    return;
  }

  try {
    const result = await Order.updateMany(
      { _id: { $in: leadIds } },
      { $set: { assignedSalesId: salesStaffId, leadStatus: "assigned" } }
    );

    console.log(`${result.modifiedCount} leads assigned to staff ${salesStaffId}`);
  } catch (err) {
    console.error("Failed to assign leads:", err);
  }

  revalidatePath("/admin/assign");
}
