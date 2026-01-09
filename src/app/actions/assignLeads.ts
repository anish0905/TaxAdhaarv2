"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function assignLeadsAction(formData: FormData): Promise<void> {
  await connectDB();

  const salesStaffId = formData.get("salesStaffId") as string;
  const leadIds = formData.getAll("leadIds") as string[];

  if (!salesStaffId || leadIds.length === 0) {
    throw new Error("Kripya leads aur staff dono select karein.");
  }

  await Order.updateMany(
    { _id: { $in: leadIds } },
    { $set: { assignedSalesId: salesStaffId } }
  );

  revalidatePath("/admin/manage-leads");
}
