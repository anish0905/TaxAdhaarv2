"use client";

import { useFormState, useFormStatus } from "react-dom";
import { uploadExcelLeads } from "@/app/actions/uploadLeads";

type UploadState = {
  success?: string;
  error?: string;
};

const initialState: UploadState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#020617] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 transition-all disabled:bg-slate-300"
    >
      {pending ? "Processing..." : "Finalize & Assign"}
    </button>
  );
}

export default function UploadForm({ salesTeam }: { salesTeam: any[] }) {
  const [state, formAction] = useFormState(uploadExcelLeads, initialState);

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* LEFT PANEL */}
        <div className="md:col-span-2 bg-[#020617] p-10 text-white">
          <h3 className="text-2xl font-black mb-4 text-blue-500">
            How it works
          </h3>
          <ul className="space-y-6 text-sm text-slate-400">
            <li>01 Upload Excel (.xlsx)</li>
            <li>02 Select Sales Staff</li>
            <li>03 Duplicates auto-skip</li>
          </ul>
        </div>

        {/* RIGHT FORM */}
        <div className="md:col-span-3 p-10">
          <form action={formAction} className="space-y-6">
            {state.error && (
              <div className="p-4 text-xs font-black bg-red-50 text-red-700 rounded-xl">
                {state.error}
              </div>
            )}

            {state.success && (
              <div className="p-4 text-xs font-black bg-green-50 text-green-700 rounded-xl">
                {state.success}
              </div>
            )}

            {/* FILE */}
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              required
            />

            {/* STAFF */}
            <select name="salesStaffId" required>
              <option value="">Select Sales Expert</option>
              {salesTeam.map((staff) => (
                <option key={staff._id} value={staff._id}>
                  {staff.name}
                </option>
              ))}
            </select>

            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}
