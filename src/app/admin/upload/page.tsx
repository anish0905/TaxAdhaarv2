"use client";

import { useFormState, useFormStatus } from "react-dom";
import { uploadExcelLeads } from "@/app/actions/uploadLeads";

type UploadState = {
  error?: string;
  success?: string;
};

const initialState: UploadState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#020617] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all disabled:bg-slate-300"
    >
      {pending ? "Processing..." : "🚀 Finalize Upload"}
    </button>
  );
}

export default function AdminUploadLeads() {
  const [state, formAction] = useFormState(
    uploadExcelLeads,
    initialState
  );

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
          Bulk Upload
        </h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
          Update database via Excel
        </p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="p-4 rounded-2xl text-xs font-black border bg-red-50 text-red-700 border-red-100">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="p-4 rounded-2xl text-xs font-black border bg-green-50 text-green-700 border-green-100">
              {state.success}
            </div>
          )}

          <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-16 flex flex-col items-center gap-4 bg-slate-50/50 hover:bg-white hover:border-blue-100 transition-all relative">
            <span className="text-5xl">📁</span>
            <p className="font-bold text-slate-600">
              Select Excel (.xlsx) Lead File
            </p>
            <input
              type="file"
              name="file"
              accept=".xlsx,.xls"
              className="absolute inset-0 opacity-0 cursor-pointer"
              required
            />
          </div>

          <input type="hidden" name="salesStaffId" value="SALES_USER_ID_HERE" />

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
