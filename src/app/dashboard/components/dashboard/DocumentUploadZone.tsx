"use client";
import { useEffect } from "react"; // 1. useEffect import karein
import { CldUploadWidget } from "next-cloudinary";
import { CheckCircle, FileText } from "lucide-react";

export default function DocumentUploadZone({ label, onUpload, isUploaded }: any) {
  
  // Cleanup logic: Jab component unmount ho ya widget band ho
  useEffect(() => {
    return () => {
      // Body ki styles ko manually reset karna
      document.body.style.overflow = "auto";
      document.body.style.position = "static";
    };
  }, []);

  return (
    <div className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${
      isUploaded ? "bg-emerald-50/50 border-emerald-200" : "bg-white border-slate-100 shadow-sm"
    }`}>
      
      {/* Header section same rahega */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isUploaded ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
          }`}>
            {isUploaded ? <CheckCircle size={18} /> : <FileText size={18} />}
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Required</p>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</h4>
          </div>
        </div>
      </div>

      <CldUploadWidget 
        uploadPreset="tax_portal_docs" 
        onSuccess={(res: any) => {
          // Success hone par bhi body reset karein
          document.body.style.overflow = "auto";
          onUpload(label, res.info.secure_url);
        }}
        onClose={() => {
          // Widget band hone par scroll wapas layein
          document.body.style.overflow = "auto";
        }}
        options={{ 
          multiple: false, 
          maxFiles: 1,
          clientAllowedFormats: ["png", "jpeg", "pdf"], // Extra safety
        }}
      >
        {({ open }) => (
          <button 
            type="button"
            onClick={() => {
              open?.();
            }}
            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isUploaded 
                ? "bg-white text-emerald-600 border border-emerald-200 hover:bg-emerald-600 hover:text-white" 
                : "bg-slate-900 text-white hover:bg-blue-600"
            }`}
          >
            {isUploaded ? "Change File" : "Upload Document"}
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}