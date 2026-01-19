"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function createFinalOrder(serviceType: string, uploadedDocs: any[]) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    // Naya Order create karein
    const newOrder = await Order.create({
      clientId: session.user.id,
      clientName: session.user.name,
      clientPhone: session.user.email,
      serviceType: serviceType,
      status: 'under_review', // Submit hote hi review phase mein
      documents: uploadedDocs.map(doc => ({
        fileName: doc.name,
        fileUrl: doc.url,
        docType: doc.name,
        uploadedBy: 'client'
      })),
      billing: {
        taxAmount: 0,
        serviceCharge: 0,
        gstAmount: 0,
        totalAmount: 0
      }
    });

    revalidatePath('/dashboard');
    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    console.error("Order Creation Error:", error);
    return { success: false, error: error.message };
  }
}