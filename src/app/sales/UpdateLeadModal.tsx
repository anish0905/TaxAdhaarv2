"use client";

import { useState } from "react";
import { updateLeadDetails, type UpdateLeadState } from "@/app/actions/updateLead";

export default function UpdateLeadModal({
  lead,
  onClose,
}: {
  lead: any;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res: UpdateLeadState = await updateLeadDetails(formData);

      if (res.error) setMessage({ type: "error", text: res.error });
      else if (res.success) {
        setMessage({ type: "success", text: res.success });
        setTimeout(onClose, 1500); // Close modal after 1.5s if success
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.message || "Failed to update lead." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg"
      >
        <h2 className="text-lg font-bold mb-4">Update Lead</h2>

        {message && (
          <div
            className={`p-2 mb-4 rounded text-sm font-bold ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Hidden Lead ID */}
        <input type="hidden" name="leadId" value={lead._id} />

        {/* Client Info */}
        <label className="block mb-2">
          Client Name
          <input
            type="text"
            name="clientName"
            defaultValue={lead.clientName}
            required
            className="w-full border px-2 py-1 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Client Phone
          <input
            type="text"
            name="clientPhone"
            defaultValue={lead.clientPhone}
            required
            className="w-full border px-2 py-1 rounded mt-1"
          />
        </label>

        {/* Service Type */}
        <label className="block mb-2">
          Service Type
          <select
            name="serviceType"
            defaultValue={lead.serviceType}
            required
            className="w-full border px-2 py-1 rounded mt-1"
          >
            <option value="GST">GST Registration/Return</option>
            <option value="ITR">ITR Filing</option>
            <option value="FSSAI">Food License (FSSAI)</option>
            <option value="MSME">MSME/Udyam</option>
            <option value="COMPANY">Company Registration</option>
          </select>
        </label>

        {/* Sales Comment / Remark */}
        <label className="block mb-2">
          Sales Comment
          <textarea
            name="salesRemarks"
            placeholder="Client se kya baat hui?"
            defaultValue={lead.salesRemarks || ""}
            className="w-full border px-2 py-1 rounded mt-1 h-20"
          />
        </label>

        {/* Lead Status */}
        <label className="block mb-4">
          Call / Lead Status
          <select
            name="leadStatus"
            defaultValue={lead.leadStatus}
            required
            className="w-full border px-2 py-1 rounded mt-1 bg-yellow-50 font-bold"
          >
            <option value="pending">Pending (Call Nahi Hua)</option>
            <option value="called">Called (Baat Chal Rahi Hai)</option>
            <option value="interested">Interested (Docs Mangwaye Hain)</option>
            <option value="not_interested">Not Interested (Junk Lead)</option>
            <option value="assigned">Assigned (Follow Up)</option>
            <option value="confirmed">✅ Confirmed (Execution Ready)</option>
          </select>
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white font-bold"
          >
            {loading ? "Updating..." : "Update Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
