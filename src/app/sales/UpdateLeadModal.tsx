"use client";

import { useState } from "react";
import { updateLeadDetails } from "@/app/actions/updateLead";

export default function UpdateLeadModal({ lead, onClose }: { lead: any; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateLeadDetails(formData);

    setLoading(false);
    if (res.error) setMessage({ type: "error", text: res.error });
    else if (res.success) setMessage({ type: "success", text: res.success });
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-lg font-bold mb-4">Update Lead</h2>

        {message && (
          <div
            className={`p-2 mb-4 rounded text-sm font-bold ${
              message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <input type="hidden" name="leadId" value={lead._id} />

        <label className="block mb-2">
          Client Name
          <input type="text" name="clientName" defaultValue={lead.clientName} className="w-full border px-2 py-1 rounded mt-1" />
        </label>

        <label className="block mb-2">
          Client Phone
          <input type="text" name="clientPhone" defaultValue={lead.clientPhone} className="w-full border px-2 py-1 rounded mt-1" />
        </label>

        <label className="block mb-4">
          Service Type
          <input type="text" name="serviceType" defaultValue={lead.serviceType} className="w-full border px-2 py-1 rounded mt-1" />
        </label>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 font-bold">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white font-bold">
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
