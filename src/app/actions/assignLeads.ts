"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function assignLeadsAction(formData: FormData) {
  await connectDB();
  
  const salesStaffId = formData.get("salesStaffId") as string;
  const leadIds = formData.getAll("leadIds") as string[]; // Multiple IDs select honge

  if (!salesStaffId || leadIds.length === 0) return { error: "Please select staff and leads" };

  await Order.updateMany(
    { _id: { $in: leadIds } },
    { $set: { assignedSalesId: salesStaffId, leadStatus: 'pending' } }
  );

  revalidatePath("/admin/leads/manage");
  return { success: "Leads Assigned Successfully" };
}