// src/app/admin/upload/page.tsx
"use client"
import { uploadExcelLeads } from "@/app/actions/uploadLeads";

export default function AdminUploadLeads() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-5">Upload Excel Leads</h1>
      <form action={uploadExcelLeads} className="flex flex-col gap-4 w-96">
        <input type="file" name="file" accept=".xlsx, .xls" className="border p-2" required />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Upload Leads to Database
        </button>
      </form>
    </div>
  );
}