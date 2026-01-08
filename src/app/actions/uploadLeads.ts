"use server" // <--- Yeh sabse upar honi chahiye

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

// Ensure karein ki 'export' keyword 'async function' se pehle hai
export async function uploadAndAssignLeads(formData: FormData) {
  try {
    await connectDB();
    const file = formData.get("file") as File;
    const salesStaffId = formData.get("salesStaffId") as string;

    if (!file || file.size === 0) {
      throw new Error("Kripya valid Excel file upload karein.");
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const leads = data.map((item: any) => ({
      clientName: item.Name || item.name || "Unknown", 
      clientPhone: String(item.Phone || item.phone || "0000000000"),
      serviceType: item.Service || "ITR",
      assignedSalesId: salesStaffId,
      leadStatus: 'pending',
      status: 'new_lead'
    }));

    await Order.insertMany(leads);
    
    revalidatePath("/admin/leads");
    return { success: `${leads.length} leads successfully upload ho gayi hain!` };

  } catch (error: any) {
    console.error("Action Error:", error.message);
    return { error: error.message || "Upload fail ho gaya" };
  }
}