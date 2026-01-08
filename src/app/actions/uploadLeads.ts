"use server"

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

export async function uploadExcelLeads(formData: FormData) {
  try {
    await connectDB();
    
    const file = formData.get("file") as File;
    const salesStaffId = formData.get("salesStaffId") as string;

    if (!file || file.size === 0) {
      throw new Error("Kripya valid Excel file upload karein.");
    }

    if (!salesStaffId) {
      throw new Error("Kripya leads assign karne ke liye staff select karein.");
    }

    // Read Excel Data
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (data.length === 0) {
      throw new Error("Excel file khaali hai!");
    }

    // Duplicate Check & Data Cleaning Logic
    const leads = [];
    const skippedPhoneNumbers = [];

    for (const item of data as any[]) {
      const phone = String(item.Phone || item.phone || "").trim();
      
      // Basic validation: Phone number hona zaroori hai
      if (phone.length < 10) continue;

      // Duplicate Check: Kya ye phone number pehle se assigned hai?
      const existingLead = await Order.findOne({ clientPhone: phone });
      
      if (!existingLead) {
        leads.push({
          clientName: (item.Name || item.name || "Customer").trim(), 
          clientPhone: phone,
          serviceType: (item.Service || item.service || "ITR").toUpperCase(),
          assignedSalesId: salesStaffId,
          leadStatus: 'pending',
          status: 'new_lead',
          createdAt: new Date()
        });
      } else {
        skippedPhoneNumbers.push(phone);
      }
    }

    if (leads.length > 0) {
      await Order.insertMany(leads);
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/assign");

    return { 
      success: `${leads.length} leads successfully upload aur assign ho gayi hain!`,
      skipped: skippedPhoneNumbers.length > 0 ? `${skippedPhoneNumbers.length} duplicates skip kiye gaye.` : null
    };

  } catch (error: any) {
    console.error("Action Error:", error.message);
    return { error: error.message || "Upload fail ho gaya" };
  }
}