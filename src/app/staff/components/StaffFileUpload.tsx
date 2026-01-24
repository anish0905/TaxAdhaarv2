"use client";
import { useState } from "react";
import { Upload, FileText, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { addOrderDocument } from "../../actions/orderActions";

export default function StaffFileUpload({ orderId, existingDocs }: { orderId: string, existingDocs: any[] }) {
  const [loading, setLoading] = useState(false);
  
  // Staff ke documents filter karein
  const staffFiles = existingDocs.filter((d: any) => d.uploadedBy === 'staff');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    
    try {
      // 1. Prepare Cloudinary Form Data
      const formData = new FormData();
      formData.append("file", file);
      
      /** * Aapne jo extra details di hain unhe yahan add kiya hai:
       * Ensure 'tax_portal_docs' is an UNSIGNED preset in Cloudinary
       */
      formData.append("upload_preset", "tax_portal_docs"); 
      formData.append("folder", "tax_portal_payments");

      // 2. Cloudinary API Call
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, 
        { method: "POST", body: formData }
      );
      
      const data = await cloudRes.json();

      if (!cloudRes.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary Upload Failed");
      }

      // 3. Server Action Call
      const result = await addOrderDocument(orderId, {
        fileName: file.name,
        fileUrl: data.secure_url,
        docType: "Government Acknowledgement", 
        uploadedBy: "staff"
      });

      if (result.success) {
        alert("Official document shared with client successfully!");
        e.target.value = ""; // Clear input
      } else {
        throw new Error(result.error || "Database update failed");
      }

    } catch (err: any) {
      console.error("Upload Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. UPLOADED FILES LIST */}
      <div className="grid grid-cols-1 gap-3">
        {staffFiles.map((file: any, index: number) => (
          <div 
            key={file.fileUrl || index} 
            className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-slate-800 uppercase leading-none truncate">
                  {file.docType}
                </p>
                <p className="text-[8px] font-bold text-slate-400 mt-1 truncate max-w-[200px]">
                  {file.fileName}
                </p>
              </div>
            </div>
            <a 
              href={file.fileUrl} 
              target="_blank" 
              className="p-2.5 bg-white hover:bg-blue-600 hover:text-white rounded-xl text-blue-600 shadow-sm transition-all active:scale-90"
            >
              <ExternalLink size={14}/>
            </a>
          </div>
        ))}
      </div>

      {/* 2. UPLOAD AREA */}
      <label className={`
        relative flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed 
        rounded-[2.5rem] p-8 transition-all group
        ${loading ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-blue-200 hover:bg-blue-50 cursor-pointer'}
      `}>
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-[10px] font-black uppercase text-blue-600 animate-pulse tracking-widest">Uploading to Cloud...</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
               <Upload size={20} />
            </div>
            <div className="text-center">
              <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block">
                Upload Govt Receipt
              </span>
              <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">
                PDF, JPG or PNG (Max 5MB)
              </span>
            </div>
          </>
        )}
        <input 
          type="file" 
          className="hidden" 
          onChange={handleFileChange} 
          disabled={loading}
          accept=".pdf,image/*" 
        />
      </label>
    </div>
  );
}