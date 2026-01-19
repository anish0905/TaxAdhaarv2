"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function saveDocumentAction(orderId: string | null, docType: string, fileUrl: string, serviceSlug: string) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) throw new Error("Unauthorized");

    let order;

    // Case 1: Agar orderId pehle se hai (Existing Order update)
    if (orderId && orderId !== "null") {
      order = await Order.findByIdAndUpdate(
        orderId,
        {
          $push: {
            documents: {
              fileName: docType,
              fileUrl: fileUrl,
              uploadedBy: 'client',
              uploadedAt: new Date()
            }
          },
          $set: { status: 'docs_pending' }
        },
        { new: true }
      );
    } 
    // Case 2: Pehla document upload ho raha hai (Naya Order create)
    else {
      order = await Order.create({
        clientId: session.user.id,
        clientName: session.user.name,
        clientPhone: session.user.email, // Ya jo bhi aap unique identifier use kar rahe hain
        serviceType: serviceSlug.toUpperCase(),
        status: 'docs_pending',
        documents: [{
          fileName: docType,
          fileUrl: fileUrl,
          uploadedBy: 'client',
          uploadedAt: new Date()
        }]
      });
    }

    revalidatePath('/dashboard');
    return { success: true, orderId: order._id.toString() };

  } catch (error: any) {
    console.error("Save Doc Error:", error);
    return { success: false, error: error.message };
  }
}

export async function finalizeSubmission(orderId: string) {
  try {
    await connectDB();
    await Order.findByIdAndUpdate(orderId, { status: 'under_review' });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}