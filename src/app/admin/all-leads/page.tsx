import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export default async function AdminMasterLeads() {
  await connectDB();

  // Saari leads fetch karein aur Sales Staff ka naam bhi join karein
  const allLeads = await Order.find()
    .populate("assignedSalesId", "name")
    .sort({ createdAt: -1 })
    .lean();

  // Summary calculation ke liye
  const stats = {
    total: allLeads.length,
    confirmed: allLeads.filter((l: any) => l.leadStatus === 'confirmed').length,
    pending: allLeads.filter((l: any) => l.leadStatus === 'pending').length,
    called: allLeads.filter((l: any) => l.leadStatus === 'called').length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Master Leads Dashboard</h1>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border font-bold">
          Total Leads: {stats.total}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-xl border-l-4 border-blue-600">
          <p className="text-sm text-blue-600 font-bold uppercase">Pending</p>
          <p className="text-2xl font-black">{stats.pending}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl border-l-4 border-yellow-600">
          <p className="text-sm text-yellow-600 font-bold uppercase">In Progress</p>
          <p className="text-2xl font-black">{stats.called}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl border-l-4 border-green-600">
          <p className="text-sm text-green-600 font-bold uppercase">Confirmed</p>
          <p className="text-2xl font-black">{stats.confirmed}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl border-l-4 border-red-600">
          <p className="text-sm text-red-600 font-bold uppercase">Converted %</p>
          <p className="text-2xl font-black">
            {stats.total > 0 ? ((stats.confirmed / stats.total) * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Client Name</th>
              <th className="p-4">Service</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Lead Status</th>
              <th className="p-4">Final Status</th>
              <th className="p-4">Payment</th>
            </tr>
          </thead>
          <tbody>
            {allLeads.map((lead: any) => (
              <tr key={lead._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 text-xs text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <p className="font-bold">{lead.clientName}</p>
                  <p className="text-xs text-gray-400">{lead.clientPhone}</p>
                </td>
                <td className="p-4 font-semibold text-blue-600">{lead.serviceType}</td>
                <td className="p-4">
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {lead.assignedSalesId?.name || "Unassigned"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lead.leadStatus === 'confirmed' ? 'bg-green-100 text-green-700' :
                    lead.leadStatus === 'called' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {lead.leadStatus.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium italic">{lead.status}</span>
                </td>
                <td className="p-4">
                  <span className={`font-bold ${lead.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                    ₹{lead.quotedAmount || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}