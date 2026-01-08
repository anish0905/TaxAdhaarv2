import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ConfirmedLeadsPage() {
  await connectDB();
  
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const salesId = session.user.id;

  // Filter: Sirf 'confirmed' leads is sales person ke liye
  const confirmedLeads = await Order.find({ 
    assignedSalesId: salesId, 
    leadStatus: 'confirmed' 
  }).sort({ updatedAt: -1 });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">✅ My Confirmed Leads</h1>
          <p className="text-slate-500 italic text-sm">Ye leads ab Admin verification ke liye queue mein hain.</p>
        </div>
        <Link 
          href="/sales" 
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition"
        >
          ← Back to Calling Queue
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-green-50 text-green-800">
            <tr>
              <th className="p-4 border-b font-bold uppercase text-xs">Client Name</th>
              <th className="p-4 border-b font-bold uppercase text-xs">Service Type</th>
              <th className="p-4 border-b font-bold uppercase text-xs">Sales Remark</th>
              <th className="p-4 border-b font-bold uppercase text-xs">System Status</th>
            </tr>
          </thead>
          <tbody>
            {confirmedLeads.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400">Abhi tak koi lead confirm nahi hui hai.</td>
              </tr>
            ) : (
              confirmedLeads.map((lead) => (
                <tr key={lead._id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{lead.clientName}</p>
                    <p className="text-sm text-slate-500">{lead.clientPhone}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {lead.serviceType}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 text-sm italic">
                    {lead.salesRemarks || "No remarks added"}
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-bold text-orange-600 animate-pulse uppercase">
                      ⌛ Awaiting Admin Pricing
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}