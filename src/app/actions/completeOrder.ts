"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function completeOrderAction(orderId: string) {
  try {
    await connectDB();
    
    await Order.findByIdAndUpdate(orderId, {
      $set: { 
        status: "completed",
        completedAt: new Date() 
      }
    });

    revalidatePath(`/staff/orders/${orderId}`);
    revalidatePath("/staff/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Complete Order Error:", error);
    return { success: false, error: "Failed to update order" };
  }
}