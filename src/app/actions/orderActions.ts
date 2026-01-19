"use server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { revalidatePath } from "next/cache";

export async function createFinalOrder(serviceType: string, uploadedDocs: any[]) {
  try {
    await connectDB();
    
    // 1. Session Validation
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Authentication failed. Please login again." };
    }

    // 2. Data Transformation (Sabse Zaroori Step)
    // Frontend se aane wale array ko Model ke format mein badalna
    const formattedDocuments = uploadedDocs.map((doc) => ({
      fileName: doc.name,     // e.g., "PAN Card"
      fileUrl: doc.url,       // e.g., "https://res.cloudinary.com/..."
      docType: doc.name,      // Type ko bhi abhi name hi rakh rahe hain
      uploadedBy: 'client',
      uploadedAt: new Date()
    }));

    // 3. New Order Object
    const newOrder = new Order({
      clientId: session.user.id,
      clientName: session.user.name,
      clientPhone: session.user.email, // Aapke schema ke hisaab se email/phone identifier
      serviceType: serviceType,
      status: 'under_review',
      documents: formattedDocuments, // Ab mapped array bhej rahe hain
      billing: {
        taxAmount: 0,
        serviceCharge: 0,
        gstAmount: 0,
        totalAmount: 0,
        isInvoiceGenerated: false
      }
    });

    // 4. Save to Database
    const savedOrder = await newOrder.save();

    // 5. Cache Revalidation
    revalidatePath("/dashboard/orders");
    
    return { 
      success: true, 
      orderId: savedOrder._id.toString() 
    };

  } catch (error: any) {
    console.error("CRITICAL_ORDER_ERROR:", error);
    return { 
      success: false, 
      error: error.message || "Internal Server Error" 
    };
  }
}




export async function generateFinalBill(data: { 
  orderId: string, 
  taxAmount: number, 
  serviceCharge: number, 
  remarks: string 
}) {
  try {
    await connectDB();

    const { orderId, taxAmount, serviceCharge, remarks } = data;

    // 1. Pehle "Tax + Service Charge" ka base total nikaalein
    const baseAmount = taxAmount + serviceCharge;

    // 2. Pure "Base Amount" par 18% GST calculate karein
    const gstAmount = (baseAmount * 18) / 100;

    // 3. Final Total = Base Amount + GST
    const totalAmount = baseAmount + gstAmount;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "billing.taxAmount": taxAmount,
          "billing.serviceCharge": serviceCharge,
          "billing.gstAmount": gstAmount, // Ab ye (Tax+Service) ka 18% hai
          "billing.totalAmount": Math.round(totalAmount), // Round figure for professional look
          "billing.billingDate": new Date(),
          "billing.isInvoiceGenerated": true,
          status: "payment_pending",
          isVerified: true,
          reviewRemarks: remarks
        }
      },
      { new: true }
    );

    if (!updatedOrder) throw new Error("Order not found");

    // Cache clear karein taaki client ko naya bill turant dikhe
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/admin/review/${orderId}`);

    return { 
      success: true, 
      message: "Bill generated on total amount successfully",
      total: totalAmount 
    };
  } catch (error: any) {
    console.error("Billing Error:", error);
    return { success: false, error: error.message };
  }
}