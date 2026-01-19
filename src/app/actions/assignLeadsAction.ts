"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function assignLeadsAction(formData: FormData) {
  try {
    await connectDB();

    // 1. Data extraction
    const salesStaffId = formData.get("salesStaffId") as string;
    const leadIds = formData.getAll("leadIds") as string[]; 

    // 2. Strict Validations
    if (!salesStaffId || salesStaffId === "") {
      return { error: "Please select a sales executive first." };
    }

    if (!leadIds || leadIds.length === 0) {
      return { error: "Please select at least one lead to assign." };
    }

    // 3. Database Update
    await Order.updateMany(
      { _id: { $in: leadIds } },
      { 
        $set: { 
          assignedSalesId: salesStaffId,
          status: "under_review", 
          assignedAt: new Date() 
        } 
      }
    );

    // 4. Cache Refresh - Path wahi rakhein jahan aapka page hai
    revalidatePath("/admin/manage-leads");

    return { 
      success: true, 
      message: `${leadIds.length} leads successfully assigned!` 
    };

  } catch (error: any) {
    console.error("Assignment Error:", error);
    return { error: "Internal Server Error. Please try again." };
  }
}