// import React from 'react';
// import { 
//   FileText, 
//   UploadCloud, 
//   Search, 
//   MoreVertical, 
//   Download, 
//   Trash2, 
//   Clock, 
//   CheckCircle2, 
//   AlertCircle,
//   Plus
// } from "lucide-react";
// import Link from 'next/link';

// export default function MyDocumentsPage() {
//   const documents = [
//     { id: 1, name: "PAN_Card_Copy.pdf", size: "1.2 MB", date: "12 Jan 2024", status: "verified", type: "PDF" },
//     { id: 2, name: "Address_Proof.jpg", size: "2.5 MB", date: "15 Jan 2024", status: "pending", type: "Image" },
//     { id: 3, name: "Income_Tax_Return.pdf", size: "850 KB", date: "18 Jan 2024", status: "rejected", type: "PDF" },
//   ];

//   return (
//     <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-0 pb-20">
      
//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//         <div>
//           <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
//             My <span className="text-blue-600">Vault</span>
//           </h1>
//           <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-2">
//             <Clock size={14} className="text-blue-600" />
//             Manage and track your submitted documentation
//           </p>
//         </div>

//         <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#020617] transition-all shadow-xl shadow-blue-200 active:scale-95">
//           <UploadCloud size={18} /> Upload New Document
//         </button>
//       </div>

//       {/* STATS SUMMARY - 2 columns on mobile, 4 on desktop */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <DocStat label="Total Files" count={12} color="blue" />
//         <DocStat label="Verified" count={8} color="emerald" />
//         <DocStat label="Pending" count={3} color="orange" />
//         <DocStat label="Action Required" count={1} color="rose" />
//       </div>

//       {/* SEARCH & FILTERS */}
//       <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search documents..."
//             className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all"
//           />
//         </div>
//         <select className="px-6 py-3 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent outline-none cursor-pointer hover:bg-slate-100 transition-all">
//           <option>All Types</option>
//           <option>PDF Documents</option>
//           <option>Images</option>
//         </select>
//       </div>

//       {/* DOCUMENT LIST - TABLE FOR DESKTOP, CARDS FOR MOBILE */}
//       <div className="bg-white md:rounded-[2.5rem] md:border border-slate-100 md:shadow-xl overflow-hidden">
        
//         {/* DESKTOP TABLE VIEW (Visible only on md screens and up) */}
//         <div className="hidden md:block overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b">
//               <tr>
//                 <th className="px-8 py-6">Document Name</th>
//                 <th className="px-6 py-6">Status</th>
//                 <th className="px-6 py-6">Upload Date</th>
//                 <th className="px-8 py-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {documents.map((doc) => (
//                 <DesktopRow key={doc.id} doc={doc} />
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* MOBILE CARD VIEW (Visible only on small screens) */}
//         <div className="md:hidden space-y-4">
//           {documents.map((doc) => (
//             <MobileCard key={doc.id} doc={doc} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Mobile Card Component
// function MobileCard({ doc }: any) {
//   return (
//     <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
//       <div className="flex justify-between items-start">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
//             <FileText size={20} />
//           </div>
//           <div>
//             <p className="text-sm font-black text-slate-900 truncate max-w-[150px]">{doc.name}</p>
//             <p className="text-[9px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
//           </div>
//         </div>
//         <StatusBadge status={doc.status} />
//       </div>
      
//       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
//         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Uploaded: {doc.date}</span>
//         <div className="flex gap-2">
//           <button className="p-2.5 bg-slate-50 text-slate-600 rounded-xl active:bg-blue-600 active:text-white transition-all">
//             <Download size={16} />
//           </button>
//           <button className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Desktop Row Component (Extracted for cleanliness)
// function DesktopRow({ doc }: any) {
//   return (
//     <tr className="group hover:bg-blue-50/30 transition-all">
//       <td className="px-8 py-6">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
//             <FileText size={20} />
//           </div>
//           <div>
//             <p className="text-sm font-black text-slate-900">{doc.name}</p>
//             <p className="text-[10px] text-slate-400 font-bold uppercase">{doc.type} • {doc.size}</p>
//           </div>
//         </div>
//       </td>
//       <td className="px-6 py-6"><StatusBadge status={doc.status} /></td>
//       <td className="px-6 py-6 text-xs font-bold text-slate-500">{doc.date}</td>
//       <td className="px-8 py-6 text-right">
//         <div className="flex items-center justify-end gap-2">
//           <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Download size={16} /></button>
//           <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
//         </div>
//       </td>
//     </tr>
//   );
// }

// // Helper Components
// function DocStat({ label, count, color }: any) {
//   const colors: any = {
//     blue: "bg-blue-50 text-blue-600 border-blue-100",
//     emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
//     orange: "bg-orange-50 text-orange-600 border-orange-100",
//     rose: "bg-rose-50 text-rose-600 border-rose-100",
//   };
//   return (
//     <div className={`p-4 rounded-2xl border ${colors[color]} space-y-1`}>
//       <p className="text-[8px] font-black uppercase tracking-widest opacity-70">{label}</p>
//       <p className="text-xl font-black italic">{count}</p>
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const configs: any = {
//     verified: { icon: <CheckCircle2 size={12} />, text: "Verified", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
//     pending: { icon: <Clock size={12} />, text: "Pending", class: "bg-orange-50 text-orange-600 border-orange-100" },
//     rejected: { icon: <AlertCircle size={12} />, text: "Rejected", class: "bg-rose-50 text-rose-600 border-rose-100" },
//   };
//   const config = configs[status];
//   return (
//     <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${config.class}`}>
//       {config.icon}
//       {config.text}
//     </div>
//   );
// }