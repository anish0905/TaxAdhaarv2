"use server"

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";

export async function submitDocsForReview(orderId: string, serviceType: string, clientInfo: any) {
  try {
    await connectDB();

    // Agar orderId nahi hai (matlab pehli baar apply kar raha hai), toh naya Order banayein
    // Agar orderId hai, toh usi ko update karein
    const filter = orderId ? { _id: orderId } : { clientPhone: clientInfo.phone, status: 'new_lead' };
    
    const update = {
      $set: {
        serviceType: serviceType,
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        status: "under_review", // CA ko signal mil jayega
        isVerified: false,
        createdAt: new Date()
      }
    };

    const options = { upsert: true, new: true };
    const order = await Order.findOneAndUpdate(filter, update, options);

    revalidatePath('/dashboard');
    return { success: true, orderId: order._id.toString() };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}