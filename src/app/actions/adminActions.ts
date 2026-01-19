"use server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export async function getClients(page: number = 1, limit: number = 8) {
  try {
    await connectDB();
    const skip = (page - 1) * limit;

    // Yahan humne role: "client" kiya hai aapke data ke hisaab se
    const clients = await User.find({ role: "client" }) 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalClients = await User.countDocuments({ role: "client" });

    return {
      success: true,
      clients: JSON.parse(JSON.stringify(clients)), // MongoDB object ko plain stringify karna zaroori hai
      totalPages: Math.ceil(totalClients / limit),
      currentPage: page
    };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return { success: false, error: error.message };
  }
}




export async function getClientDetails(clientId: string) {
  try {
    await connectDB();
    
    // 1. Client find karein
    const client = await User.findById(clientId).lean();
    if (!client) return { success: false, error: "Client not found" };

    // 2. Us client ke orders dhoondein (using email/phone match)
    const orders = await Order.find({ clientPhone: client.email })
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      client: JSON.parse(JSON.stringify(client)),
      orders: JSON.parse(JSON.stringify(orders))
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}