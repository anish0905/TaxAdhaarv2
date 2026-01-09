"use client";

import { useState } from "react";
import { updateLeadDetails, type UpdateLeadState } from "@/app/actions/updateLead";

export default function LeadUpdateForm({ lead }: { lead: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res: UpdateLeadState = await updateLeadDetails(formData);
      if (res.success) {
        setMessage({ type: "success", text: res.success });
      } else if (res.error) {
        setMessage({ type: "error", text: res.error });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update lead." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm"
    >
      {/* Success/Error Message */}
      {message && (
        <div className={`p-2 text-sm font-bold rounded ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-100"
            : "bg-red-50 text-red-700 border border-red-100"
        }`}>
          {message.text}
        </div>
      )}

      <input type="hidden" name="leadId" value={lead._id} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500">CLIENT NAME</label>
          <input
            name="clientName"
            defaultValue={lead.clientName}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">PHONE NO</label>
          <input
            key={lead._id}
            type="text"
            name="clientPhone"
            defaultValue={lead.clientPhone || ""}
            className="w-full border p-2 rounded text-black bg-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">SELECT SERVICE (BUSINESS TYPE)</label>
        <select
          name="serviceType"
          defaultValue={lead.serviceType}
          className="w-full border p-2 rounded"
        >
          <option value="GST">GST Registration/Return</option>
          <option value="ITR">ITR Filing</option>
          <option value="FSSAI">Food License (FSSAI)</option>
          <option value="MSME">MSME/Udyam</option>
          <option value="COMPANY">Company Registration</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">SALES COMMENT (REMARK)</label>
        <textarea
          name="comment"
          placeholder="Client se kya baat hui?"
          className="w-full border p-2 rounded h-20"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">CALL STATUS</label>
        <select
          name="status"
          className="w-full border p-2 rounded font-bold bg-yellow-50"
        >
          <option value="pending">Pending (Call Nahi Hua)</option>
          <option value="called">Called (Baat Chal Rahi Hai)</option>
          <option value="interested">Interested (Docs Mangwaye Hain)</option>
          <option value="not_interested">Not Interested (Junk Lead)</option>
          <option value="confirmed">✅ Confirmed (Execution ke liye Ready)</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 mt-2"
      >
        {loading ? "Updating..." : "Update & Save Lead"}
      </button>
    </form>
  );
}
