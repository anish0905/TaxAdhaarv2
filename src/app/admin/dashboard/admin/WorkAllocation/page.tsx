import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { Workallocation } from "@/app/actions/Workallocation";
import { UserPlus, CheckSquare, IndianRupee, ShieldCheck, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminWorkAllocation() {
  await connectDB();

  // 1. FILTER: Sirf PAID clients jo abhi tak assign nahi hue hain
// 1. FILTER logic ko aise badlein
const rawClients = await Order.find({
  paymentStatus: "paid",
  $or: [
    { assignedSalesId: { $exists: false } },
    { assignedSalesId: null }
    // "" (empty string) ko hata dein kyunki ye ObjectId error deta hai
  ]
}).sort({ updatedAt: -1 }).lean();

  const paidClients = JSON.parse(JSON.stringify(rawClients));

  // 2. FILTER: Sirf Staff members ko fetch karein
  const rawStaff = await User.find({ role: "staff" }).lean();
  const staffMembers = JSON.parse(JSON.stringify(rawStaff));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            Work <span className="text-blue-600">Allocation</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-3 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" /> 
            Assign paid orders to processing staff
          </p>
        </div>
        
        <div className="bg-white px-8 py-4 rounded-3xl shadow-sm border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase">Pending Assignment</p>
           <p className="text-2xl font-black text-blue-600 italic">{paidClients.length}</p>
        </div>
      </div>

  <form action={async (formData: FormData) => {
    "use server"; // Ye line zaroori hai agar aap server component mein hain
    await Workallocation(formData);
}}>
        {/* ASSIGNMENT BAR */}
        <div className="bg-[#020617] p-6 rounded-[2.5rem] shadow-2xl mb-8 sticky top-24 z-30 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <UserPlus size={22} />
            </div>
            <div className="flex-1">
              <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Target Staff Member</label>
              <select 
                name="salesStaffId" 
                required
                className="bg-transparent text-white font-black uppercase text-xs focus:outline-none cursor-pointer w-full"
              >
                <option value="" className="text-slate-900">-- Choose Staff --</option>
                {staffMembers.map((staff: any) => (
                  <option key={staff._id} value={staff._id} className="text-slate-900">
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl active:scale-95"
          >
            Confirm Assignment
          </button>
        </div>

        {/* PAID CLIENTS LIST */}
        <div className="bg-white rounded-[3.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b">
                <tr>
                  <th className="px-10 py-7 w-12 text-center"><CheckSquare size={16} /></th>
                  <th className="px-8 py-7">Client Details</th>
                  <th className="px-8 py-7">Service & Amount</th>
                  <th className="px-8 py-7">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paidClients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                         <ShieldCheck size={64} />
                         <p className="font-black uppercase text-sm tracking-widest">No new paid clients found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paidClients.map((client: any) => (
                    <tr key={client._id} className="hover:bg-blue-50/40 transition-all group">
                      <td className="px-10 py-7 text-center">
                        <input 
                          type="checkbox" 
                          name="leadIds" 
                          value={client._id}
                          className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer" 
                        />
                      </td>
                      <td className="px-8 py-7">
                        <div>
                          <p className="font-black text-slate-900 text-sm uppercase leading-none mb-1.5">{client.clientName}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{client.clientPhone}</p>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase w-fit border border-blue-100">
                             {client.serviceType}
                           </span>
                           <div className="flex items-center gap-1 text-emerald-600 font-black text-xs italic">
                              <IndianRupee size={12} /> {client.billing?.totalAmount}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-7">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {new Date(client.updatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
}