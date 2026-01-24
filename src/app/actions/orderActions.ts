"use server";
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { activateReferralBonus } from "../actions/activateReferral"; // Purana banaya hua action

import { revalidatePath } from "next/cache";

export async function createFinalOrder(
  serviceType: string, 
  uploadedDocs: any[], 
  additionalInfo: Record<string, any> // Naya parameter: Question answers ke liye
) {
  try {
    await connectDB();
    
    // 1. Session Validation
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, error: "Authentication failed. Please login again." };
    }

    // 2. Documents Transformation
    const formattedDocuments = uploadedDocs.map((doc) => ({
      fileName: doc.name,
      fileUrl: doc.url,
      docType: doc.name,
      uploadedBy: 'client',
      uploadedAt: new Date()
    }));

    // 3. New Order Object with Metadata
    const newOrder = new Order({
     clientId: session.user.id,
  clientName: session.user.name,
  clientPhone: additionalInfo.mobile || session.user.email, // Agar metadata mein mobile hai toh wo uthao
  serviceType: serviceType,
  status: 'under_review',
  documents: formattedDocuments,
  metadata: additionalInfo,

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

    // 5. Cache Revalidation (Dashboard update ke liye)
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

    // 1. Base Amount (Govt Tax + AimGrit Service Fee)
    const baseAmount = Number(taxAmount) + Number(serviceCharge);

    // 2. GST Calculation (Standard 18% on the entire professional service)
    const gstRate = 18;
    const gstAmount = (baseAmount * gstRate) / 100;

    // 3. Grand Total Calculation
    const totalAmount = baseAmount + gstAmount;

    // 4. Update Database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          "billing.taxAmount": taxAmount,
          "billing.serviceCharge": serviceCharge,
          "billing.gstAmount": Number(gstAmount.toFixed(2)), // Store with 2 decimal precision
          "billing.totalAmount": Math.round(totalAmount),    // Client ko round figure dikhana professional hota hai
          "billing.isInvoiceGenerated": true,
          "billing.billingDate": new Date(),
          
          // Workflow Update
          status: "payment_pending", // Iske baad user ko "Pay Now" button dikhega
          isVerified: true,
          reviewRemarks: remarks
        }
      },
      { new: true }
    );

    if (!updatedOrder) throw new Error("CRITICAL_ERROR: Order not found for billing");

    // 5. Cache Revalidation
    revalidatePath(`/dashboard/orders`);
    revalidatePath(`/dashboard/admin/orders/${orderId}`); // Admin view refresh

    return { 
      success: true, 
      message: `Invoice generated for ₹${Math.round(totalAmount)}`,
      data: {
        total: Math.round(totalAmount),
        gst: gstAmount
      }
    };

  } catch (error: any) {
    console.error("BILLING_GENERATION_FAILED:", error);
    return { success: false, error: error.message || "Failed to generate invoice" };
  }
}


export async function addOrderDocument(orderId: string, docData: {
  fileName: string,
  fileUrl: string,
  docType: string,
  uploadedBy: 'staff' | 'admin' | 'client'
}) {
  try {
    await connectDB();

    // Database mein Order ke documents array mein naya document push karein
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $push: {
          documents: {
            ...docData,
            uploadedAt: new Date()
          }
        },
        // Jab staff slip upload kare, toh status ko 'processing' se aage badha sakte hain
        status: docData.uploadedBy === 'staff' ? 'processing' : undefined 
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    // Dono side ke views refresh karein
    revalidatePath(`/dashboard/orders/${orderId}`); // Client side
    revalidatePath(`/staff/orders/${orderId}`);     // Staff side
    
    return { success: true, data: JSON.parse(JSON.stringify(updatedOrder)) };
  } catch (error: any) {
    console.error("Add Document Error:", error);
    return { success: false, error: error.message };
  }
}

