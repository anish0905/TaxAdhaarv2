import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { assignLeadsAction } from "@/app/actions/assignLeads";

export default async function AdminManageLeads() {
  await connectDB();

  const unassignedLeads = await Order.find({
    assignedSalesId: { $exists: false },
  }).sort({ createdAt: -1 });

  const salesStaff = await User.find({ role: "sales" });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">
          Manage & Assign Leads
        </h1>
        <p className="text-slate-500">
          Select unassigned leads and allocate to sales staff.
        </p>
      </div>

      <form action={assignLeadsAction}>
        {/* Action Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">
              Assign To
            </span>
            <select
              name="salesStaffId"
              required
              className="border px-3 py-2 rounded-lg bg-blue-50 text-blue-800 font-bold focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select Staff --</option>
              {salesStaff.map((staff) => (
                <option key={staff._id} value={staff._id.toString()}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#020617] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all"
          >
            Assign Selected
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">
                  Client
                </th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">
                  Service
                </th>
                <th className="p-4 text-xs font-black uppercase text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {unassignedLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-slate-400 italic"
                  >
                    All leads are assigned 🎉
                  </td>
                </tr>
              ) : (
                unassignedLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="border-b hover:bg-blue-50/40"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        name="leadIds"
                        value={lead._id.toString()}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </td>

                    <td className="p-4">
                      <p className="font-black text-slate-900">
                        {lead.clientName}
                      </p>
                      <p className="text-xs font-bold text-slate-400">
                        {lead.clientPhone}
                      </p>
                    </td>

                    <td className="p-4">
                      <span className="text-[10px] font-black uppercase px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {lead.serviceType}
                      </span>
                    </td>

                    <td className="p-4 text-xs font-bold text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}
