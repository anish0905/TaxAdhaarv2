import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { uploadAndAssignLeads } from "@/app/actions/uploadLeads";

export default async function AdminLeadsPage() {
  await connectDB();
  
  // lean() aur JSON stringify se hum MongoDB ke complex objects ko plain data banate hain
  const salesTeamRaw = await User.find({ role: 'sales' }).lean();
  const salesTeam = JSON.parse(JSON.stringify(salesTeamRaw));

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border">
      <h1 className="text-2xl font-bold mb-2 text-black text-center">Bulk Import & Auto-Assign</h1>
      <p className="text-gray-500 text-center mb-8 text-sm">Excel upload karein aur sales team ko leads distribute karein.</p>
      
      <form action={uploadAndAssignLeads} className="space-y-6">
        {/* Step 1: Excel File */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">1. Upload Excel File</label>
          <input 
            type="file" 
            name="file" 
            accept=".xlsx, .xls" 
            className="border-2 border-dashed p-4 rounded-xl bg-gray-50 hover:border-blue-400 transition cursor-pointer text-black"
            required 
          />
        </div>

        {/* Step 2: Select Sales Staff */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">2. Select Sales Person to Assign</label>
          <select 
            name="salesStaffId" 
            className="border p-3 rounded-xl bg-white text-black font-medium focus:ring-2 focus:ring-blue-500 outline-none" 
            required
          >
            <option value="">-- Choose Sales Staff --</option>
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
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Upload & Assign Now
        </button>
      </form>
    </div>
  );
}