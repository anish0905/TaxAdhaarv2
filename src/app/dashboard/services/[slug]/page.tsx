"use client";
import { use, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { servicesData } from "@/data/services";
import { ArrowLeft, ShieldCheck, FileCheck, AlertCircle, Loader2, HelpCircle } from "lucide-react";
import Link from "next/link";
import DocumentUploadZone from "@/app/dashboard/components/dashboard/DocumentUploadZone";
import { motion, AnimatePresence } from "framer-motion"; // Fixed: Added missing imports
import { createFinalOrder } from "@/app/actions/orderActions";

export default function ServiceProcessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const variantId = searchParams.get("variant");
  const service = servicesData[slug];
  const activeVariant = service?.variants.find((v: any) => v.id === variantId) || service?.variants?.[0];

  const [filesList, setFilesList] = useState<{name: string, url: string}[]>([]);
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fix: Hydration issues ke liye ensure karein ki client-side render ho raha hai
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!service || !activeVariant) return <div className="p-20 text-center font-bold font-sans">Service Not Found</div>;

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCollectFiles = (name: string, url: string) => {
    setFilesList(prev => {
      const filtered = prev.filter(f => f.name !== name);
      return [...filtered, { name, url }];
    });
  };

const handleFinalSubmit = async () => {
  setIsSubmitting(true);
  
  // createFinalOrder ko teen cheezein bhej rahe hain
  const res = await createFinalOrder(
    activeVariant.label.toUpperCase(), // Service Name
    filesList,                         // Documents
    formData                           // Form Answers
  );

  if (res.success) {
    router.push("/dashboard/orders?msg=success");
  } else {
    alert(res.error);
    setIsSubmitting(false);
  }
};

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32 font-sans">
      {/* Header Section */}
      <div className="bg-[#020617] text-white pt-20 pb-24 px-6 rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl">
        <div className="max-w-5xl mx-auto">
          <Link href="/dashboard/services" className="inline-flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-8 hover:text-white transition-all">
            <ArrowLeft size={16} /> Back to Hub
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                Step 2: Filing Process
              </span>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mt-4 leading-none">
                {activeVariant.label}
              </h1>
              <p className="text-slate-800 font-bold text-xs mt-2 uppercase tracking-[0.1em]">{service.title}</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-[2rem] backdrop-blur-xl text-center min-w-[120px]">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Upload Progress</p>
              <p className="text-2xl font-black italic">{filesList.length} / {activeVariant.docs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 space-y-8">
            {/* DYNAMIC QUESTIONNAIRE SECTION */}
          <AnimatePresence mode="wait">
            {activeVariant.questions && activeVariant.questions.length > 0 && (
              <motion.div
                key={`${activeVariant.id}-questions`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-400 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <HelpCircle size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
                      Additional Information 
                    </h3>
                    <p className="text-[9px] font-bold text-slate-800 uppercase tracking-tight">Required for CA Verification</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeVariant.questions.map((q: any) => (
                    <div key={q.id} className="group space-y-2">
                      <label className="text-[10px] font-black text-slate-800 uppercase ml-2 tracking-widest group-hover:text-blue-600 transition-colors">
                        {q.text}
                      </label>
                      
                      {q.type === "boolean" ? (
                        <div className="flex gap-2">
                          {["Yes", "No"].map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleInputChange(q.id, opt === "Yes")}
                              className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all border-2 ${
                                formData[q.id] === (opt === "Yes")
                                ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input 
                          type={q.type}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder={`Enter details...`}
                          className="w-full p-4 text-black bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none text-sm font-bold transition-all shadow-inner"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Document Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <FileCheck size={18} className="text-blue-600" /> Mandatory Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeVariant.docs.map((doc: string) => (
                <DocumentUploadZone 
                  key={doc}
                  label={doc} 
                  onUpload={handleCollectFiles} 
                  isUploaded={filesList.some(f => f.name === doc)} 
                />
              ))}
            </div>
          </div>

        

          {/* Expert Instruction */}
          <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={20} />
            <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
              <b>Expert Tip:</b> {activeVariant.note} 
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Action Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-400 shadow-xl sticky top-10">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-800 mb-6">Filing Summary</h3>
            
            <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-3xl">
              <div className="flex justify-between items-center text-slate-900">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Documents</span>
                <span className="text-xs font-black">{filesList.length} / {activeVariant.docs.length}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Information</span>
                <span className="text-xs font-black">
                  {Object.keys(formData).length} / {activeVariant.questions?.length || 0}
                </span>
              </div>
            </div>

            <button 
              onClick={handleFinalSubmit}
              disabled={isSubmitting || filesList.length < activeVariant.docs.length}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Submit Order"
              )}
            </button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-800 font-bold uppercase tracking-widest">
              <ShieldCheck size={14} className="text-emerald-500" /> Secure Data Handling
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}