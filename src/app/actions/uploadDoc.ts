"use server"
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function uploadDocument(formData: FormData) {
  await connectDB();
  
  const orderId = formData.get("orderId") as string;
  const file = formData.get("file") as File;
  const uploadedBy = formData.get("role") as string; // 'admin' or 'client'

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  // 1. Cloudinary par upload karo
  const res = await uploadToCloudinary(fileUri, `${orderId}_${Date.now()}`);

  // 2. MongoDB mein update karo
  await Order.findByIdAndUpdate(orderId, {
    $push: {
      documents: {
        fileName: file.name,
        fileUrl: res.secure_url,
        publicId: res.public_id,
        uploadedBy: uploadedBy
      }
    },
    status: 'docs_submitted' // Status update kardo
  });

  revalidatePath("/admin/verify");
}