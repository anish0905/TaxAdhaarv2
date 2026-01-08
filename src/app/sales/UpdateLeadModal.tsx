"use client"
import { updateLeadDetails } from "@/app/actions/updateLead";
import { useState } from "react";

export default function UpdateLeadModal({ lead, onClose }: { lead: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Update Client Info</h2>
        
        <form action={async (formData) => {
          await updateLeadDetails(formData);
          onClose(); // Kaam hone ke baad modal band ho jaye
        }} className="space-y-4">
          <input type="hidden" name="id" value={lead._id} />

    <div>
  <label className="text-xs font-bold text-gray-500 uppercase">Client Name</label>
  <input name="name" defaultValue={lead.clientName} className="w-full border p-2 rounded text-black bg-gray-50" />
</div>

{/* YE WALA SECTION ADD KAREIN */}
<div>
  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
  <input 
    name="phone" 
    defaultValue={lead.clientPhone} 
    required
    className="w-full border p-2 rounded text-black bg-gray-50" 
  />
</div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Service Required</label>
            <select name="service" defaultValue={lead.serviceType} className="w-full border p-2 rounded text-black bg-gray-50">
              <option value="ITR">ITR Filing</option>
              <option value="GST">GST Registration</option>
              <option value="FSSAI">Food License (FSSAI)</option>
              <option value="MSME">MSME/Udyam</option>
              <option value="COMPANY">Company Registration</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Sales Remark (Comment)</label>
            <textarea name="comment" placeholder="Kya baat hui? (e.g. Kal call karein)" className="w-full border p-2 rounded h-20 text-black bg-gray-50" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Call Status</label>
            <select name="status" className="w-full border p-2 rounded font-bold bg-blue-50 text-blue-800">
              <option value="pending">Pending</option>
              <option value="called">Called / Follow-up</option>
              <option value="interested">Interested (Sending Docs)</option>
              <option value="confirmed">✅ Confirmed (Ready for Filing)</option>
              <option value="rejected">Not Interested / Junk</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 text-black p-2 rounded font-semibold">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}