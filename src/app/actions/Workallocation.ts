"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function Workallocation(formData: FormData) {
  try {
    await connectDB();

    // 1. Form se data nikalna
    const salesStaffId = formData.get("salesStaffId") as string;
    const leadIds = formData.getAll("leadIds") as string[]; // Multiple checkboxes ke liye

    // 2. Validation
    if (!salesStaffId) {
      return { error: "Kripya ek staff member select karein." };
    }

    if (leadIds.length === 0) {
      return { error: "Kripya kam se kam ek client select karein." };
    }

    // 3. Database Update (Bulk Update)
    // Hum un saare orders ko update kar rahe hain jinki IDs array mein hain
    await Order.updateMany(
      { _id: { $in: leadIds } },
      { 
        $set: { 
          assignedSalesId: salesStaffId,
          // Kaam assign hone par hum status ko 'in-progress' bhi kar sakte hain
          status: "in-progress", 
          assignedAt: new Date() 
        } 
      }
    );

    // 4. Cache Clear karna taaki UI turant update ho jaye
    revalidatePath("/admin/dashboard/admin/WorkAllocation");
    
    return { success: true, message: "Work successfully assigned to staff!" };

  } catch (error: any) {
    console.error("Assignment Error:", error);
    return { error: "Database update fail ho gaya. Kripya dubara koshish karein." };
  }
}