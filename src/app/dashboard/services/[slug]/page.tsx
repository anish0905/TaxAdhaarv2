"use client";
import React, { useState, use, useEffect } from "react";
import { servicesData } from "@/data/services";
import DocumentUploadZone from "@/app/dashboard/components/dashboard/DocumentUploadZone";
import { createFinalOrder } from "@/app/actions/orderActions";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2, ArrowLeft, Loader2, Info } from "lucide-react";
import Link from "next/link";

export default function DocumentProcessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = servicesData[slug];
  const router = useRouter();

  const [filesList, setFilesList] = useState<{name: string, url: string}[]>([]);
  const [extraSlots, setExtraSlots] = useState<{id: number, label: string}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix: Scroll lock issue after Cloudinary widget closes
  useEffect(() => {
    const fixScroll = () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
    };
    window.addEventListener('focus', fixScroll);
    return () => window.removeEventListener('focus', fixScroll);
  }, []);

  const handleCollectFiles = (name: string, url: string) => {
    setFilesList(prev => {
      const filtered = prev.filter(f => f.name !== name);
      return [...filtered, { name, url }];
    });
  };

  const handleDeleteFile = (name: string) => {
    setFilesList(prev => prev.filter(f => f.name !== name));
  };

  const handleFinalSubmit = async () => {
    if (filesList.length < service.docs.length) {
      return alert("Please upload all mandatory documents.");
    }
    setIsSubmitting(true);
    const res = await createFinalOrder(slug.toUpperCase(), filesList);
    if (res.success) router.push("/dashboard?msg=success");
    else alert(res.error);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Dynamic Header */}
      <div className="bg-[#020617] text-white pt-20 pb-24 px-6 rounded-b-[4rem] shadow-2xl">
        <div className="max-w-5xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-widest mb-10 hover:text-white transition-all">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">{service.title}</h1>
              <p className="text-slate-400 font-bold text-xs mt-4 uppercase tracking-[0.2em]">Compliance & Filing Department</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] backdrop-blur-xl">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Upload Progress</p>
              <p className="text-2xl font-black italic">{filesList.length} / {service.docs.length + extraSlots.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12">
        {/* Helper Note */}
        <div className="bg-blue-600 text-white p-4 rounded-2xl mb-8 flex items-center gap-4 shadow-lg shadow-blue-200">
          <Info size={20} />
          <p className="text-[10px] font-black uppercase tracking-widest">Ensure all documents are clear and original copies for faster CA review.</p>
        </div>

        {/* Mandatory Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {service.docs.map((doc: string) => {
            const uploadedFile = filesList.find(f => f.name === doc);
            return (
              <div key={doc} className="relative group">
                <DocumentUploadZone 
                  label={doc} 
                  onUpload={handleCollectFiles} 
                  isUploaded={!!uploadedFile} 
                />
                {uploadedFile && (
                  <button 
                    onClick={() => handleDeleteFile(doc)}
                    className="absolute top-4 right-4 z-20 bg-red-500 text-white p-2 rounded-xl hover:scale-110 transition-all shadow-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Documents Section */}
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 mb-12">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900">Additional Files</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Optional documents for better verification</p>
            </div>
            <button 
              onClick={() => setExtraSlots([...extraSlots, {id: Date.now(), label: `Extra Doc ${extraSlots.length + 1}` }])}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#020617] transition-all shadow-lg shadow-blue-100"
            >
              <PlusCircle size={14} /> Add Slot
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {extraSlots.map((slot) => {
              const uploadedFile = filesList.find(f => f.name === slot.label);
              return (
                <div key={slot.id} className="relative">
                  <DocumentUploadZone 
                    label={slot.label} 
                    onUpload={handleCollectFiles} 
                    isUploaded={!!uploadedFile}
                  />
                  <button 
                    onClick={() => {
                      handleDeleteFile(slot.label);
                      setExtraSlots(prev => prev.filter(s => s.id !== slot.id));
                    }}
                    className="absolute top-4 right-4 z-20 bg-slate-100 text-slate-400 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky Submit Bar */}
      <div className="fixed text-center bottom-8 left-6 right-6 z-50 max-w-2xl mx-auto">
  <button
    onClick={handleFinalSubmit}
    disabled={isSubmitting || filesList.length < service.docs.length}
    className="
      relative w-full overflow-hidden
      rounded-[2.5rem] py-8
      font-extrabold uppercase tracking-[0.25em]
      text-white
      bg-gradient-to-br from-[#020617] via-[#030b2a] to-[#020617]
      shadow-[0_25px_60px_rgba(2,6,23,0.6)]
      transition-all duration-300
      hover:shadow-[0_35px_80px_rgba(37,99,235,0.45)]
      hover:-translate-y-0.5
      active:translate-y-0
      disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
      flex items-center justify-center gap-4
      ring-1 ring-white/10
    "
  >
    {/* subtle glow */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />

    {isSubmitting ? (
      <Loader2 className="animate-spin text-blue-400" size={26} />
    ) : (
      <>
        <span>Submit for CA Review</span>
        <ArrowLeft className="rotate-180 opacity-80" size={22} />
      </>
    )}
  </button>
</div>

      </div>
    </div>
  );
}