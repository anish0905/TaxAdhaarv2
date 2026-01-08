"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function setOrderPrice(formData: FormData) {
  await connectDB();
  
  const orderId = formData.get("orderId") as string;
  const amount = formData.get("amount") as string;

  await Order.findByIdAndUpdate(orderId, {
    quotedAmount: Number(amount),
    isVerified: true,
    status: 'verified' // Client ab pay kar sakta hai
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/verify");
}