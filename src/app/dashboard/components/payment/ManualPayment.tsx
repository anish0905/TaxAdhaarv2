"use client"
import { useState } from "react";
import { Upload, X, Loader2, Copy, Check, QrCode as QrIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { submitManualPayment } from "@/app/actions/paymentActions";

export function ManualPayment({ orderId, amount = 0 }: { orderId: string, amount: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "ca.anishkumar@upi";
  const merchantName = "CA Anish Kumar";
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpload = async () => {
    if (!file) return alert("Pehle screenshot select karein!");
    
    // Safety check: File type verify karein
    if (!file.type.startsWith("image/")) {
      return alert("Sirf images (JPG, PNG) hi allowed hain!");
    }

    setLoading(true);

    try {
      let fileToUpload = file;

      // 1. Dynamic Import for Compression
      if (file.size > 300 * 1024) {
        const imageCompression = (await import("browser-image-compression")).default;
        const options = {
          maxSizeMB: 0.18, 
          maxWidthOrHeight: 1280,
          useWebWorker: true,
        };
        fileToUpload = await imageCompression(file, options);
      }

      // 2. Prepare Form Data
      const formData = new FormData();
      formData.append("file", fileToUpload);
      // Ensure 'tax_portal_docs' is an UNSIGNED preset in Cloudinary Settings
      formData.append("upload_preset", "tax_portal_docs"); 
      formData.append("folder", "tax_portal_payments");

      // 3. Cloudinary API Call
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) throw new Error("Cloudinary Cloud Name missing in env!");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary Upload Failed");
      }

      // 4. Database update via Server Action
      const dbResponse = await submitManualPayment(orderId, data.secure_url);

      if (dbResponse?.success) {
        alert("Success! Verification request bhej di gayi hai.");
        setIsOpen(false);
        setFile(null);
      } else {
        throw new Error("Database update failed. Please try again.");
      }
      
    } catch (error: any) {
      console.error("Payment Error:", error);
      alert(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
        >
          <QrIcon size={14} className="group-hover:scale-110 transition-transform" /> 
          Pay via QR / Bank Transfer
        </button>
      ) : (
        <div className="bg-[#0f172a] rounded-[2.5rem] p-6 border border-white/10 animate-in fade-in zoom-in duration-300 shadow-2xl">
           {/* Header */}
           <div className="flex justify-between items-center mb-6 text-white">
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Step 1: Scan QR</span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-6 rounded-[2rem] mx-auto w-fit mb-6 shadow-2xl shadow-blue-500/10">
            <QRCodeSVG value={upiLink} size={160} level="H" includeMargin={false} />
          </div>

          {/* Amount Display */}
          <div className="text-center mb-8 text-white">
            <p className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Amount to Pay</p>
            <h4 className="text-3xl font-black italic tracking-tighter">₹{Number(amount || 0).toLocaleString('en-IN')}</h4>
            
            <div 
              className="mt-4 flex items-center justify-center gap-2 bg-white/5 py-2 px-4 rounded-xl border border-white/5 w-fit mx-auto cursor-pointer hover:bg-white/10 transition-all group" 
              onClick={copyToClipboard}
            >
              <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300">{upiId}</span>
              {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} className="text-slate-400" />}
            </div>
          </div>

          {/* Upload Section */}
          <div className="border-t border-white/10 pt-6">
            <span className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em] mb-4 block text-center italic">Step 2: Upload Screenshot</span>
            
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2rem] p-6 hover:border-blue-500 hover:bg-blue-500/5 cursor-pointer group transition-all relative overflow-hidden">
              <Upload size={24} className="text-slate-500 group-hover:text-blue-500 mb-2 transition-colors" />
              <span className="text-[10px] font-black uppercase text-slate-400 text-center truncate max-w-full px-4 group-hover:text-slate-300">
                {file ? <span className="text-blue-400">{file.name}</span> : "Select Payment Proof"}
              </span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
            </label>

            {file && (
              <button 
                onClick={handleUpload} 
                disabled={loading} 
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-xl shadow-blue-900/20 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  "Submit Verification Request"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}