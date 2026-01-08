import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { uploadExcelLeads } from "@/app/actions/uploadLeads"; // Naam sahi rakhein
import PublicNavbar from "@/components/Navbar";

export default async function AdminLeadsPage() {
  await connectDB();
  
  // Sales team fetch karna
  const salesTeamRaw = await User.find({ role: 'sales' }).lean();
  const salesTeam = JSON.parse(JSON.stringify(salesTeamRaw));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Distribute Leads</h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
          Bulk Import & Auto-Assign to Sales Team
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          
          {/* Left Info Panel */}
          <div className="md:col-span-2 bg-[#020617] p-10 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-4 tracking-tight text-blue-500">How it works</h3>
              <ul className="space-y-6 text-sm font-medium text-slate-400">
                <li className="flex gap-3">
                  <span className="text-blue-500 font-black">01</span>
                  Select your Excel file (.xlsx) with client data.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-black">02</span>
                  Choose a dedicated sales person for these leads.
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-black">03</span>
                  System will automatically skip duplicate phone numbers.
                </li>
              </ul>
            </div>
            <div className="pt-8 border-t border-slate-800">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure AES-256 Database</p>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="md:col-span-3 p-10">
            <form action={uploadExcelLeads} className="space-y-8">
              
              {/* Step 1: File Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">1. Upload Excel Data</label>
                <div className="relative group">
                   <div className="absolute inset-0 bg-blue-50 rounded-2xl border-2 border-dashed border-slate-200 group-hover:border-blue-400 transition-all"></div>
                   <input 
                    type="file" 
                    name="file" 
                    accept=".xlsx, .xls" 
                    className="relative z-10 w-full p-8 opacity-0 cursor-pointer"
                    required 
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none gap-3">
                     <span className="text-2xl">📊</span>
                     <p className="text-sm font-bold text-slate-500">Click to attach file</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Staff Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">2. Assign to Staff</label>
                <select 
                  name="salesStaffId" 
                  className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-50 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer" 
                  required
                >
                  <option value="">-- Select Sales Expert --</option>
                  {salesTeam.map((staff: any) => (
                    <option key={staff._id} value={staff._id.toString()}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: Action Button */}
              <button 
                type="submit" 
                className="w-full bg-[#020617] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 shadow-xl transition-all active:scale-[0.98] mt-4"
              >
                Finalize & Assign
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}