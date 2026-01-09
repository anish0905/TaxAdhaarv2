"use server";

import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import * as XLSX from "xlsx";
import { revalidatePath } from "next/cache";

type UploadState = {
  success?: string;
  error?: string;
};

export async function uploadExcelLeads(
  prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  try {
    await connectDB();

    const file = formData.get("file") as File | null;
    const salesStaffId = formData.get("salesStaffId") as string | null;

    if (!file || file.size === 0) {
      return { error: "Kripya valid Excel file upload karein." };
    }

    if (!salesStaffId) {
      return { error: "Kripya sales staff select karein." };
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (rows.length === 0) {
      return { error: "Excel file khaali hai." };
    }

    const leads: any[] = [];
    let skipped = 0;

    for (const row of rows as any[]) {
      const phone = String(row.Phone || row.phone || "").trim();

      if (phone.length < 10) continue;

      const exists = await Order.findOne({ clientPhone: phone });
      if (exists) {
        skipped++;
        continue;
      }

      leads.push({
        clientName: (row.Name || row.name || "Customer").trim(),
        clientPhone: phone,
        serviceType: (row.Service || row.service || "ITR").toUpperCase(),
        assignedSalesId: salesStaffId,
        leadStatus: "pending",
        status: "new_lead",
        createdAt: new Date(),
      });
    }

    if (leads.length > 0) {
      await Order.insertMany(leads);
    }

    revalidatePath("/admin/leads");
    revalidatePath("/admin/assign");

    return {
      success: `${leads.length} leads uploaded. ${skipped} duplicates skipped.`,
    };
  } catch (err: any) {
    console.error(err);
    return { error: "Excel upload failed. File format check karein." };
  }
}
