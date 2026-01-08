import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import AssignLeadsForm from "@/components/admin/AssignLeadsForm";

export default async function AdminManageLeads() {
  await connectDB();

  // Data fetch as plain JSON objects
  const leadsRaw = await Order.find({ assignedSalesId: { $exists: false } }).sort({ createdAt: -1 }).lean();
  const staffRaw = await User.find({ role: 'sales' }).lean();

  const unassignedLeads = JSON.parse(JSON.stringify(leadsRaw));
  const salesStaff = JSON.parse(JSON.stringify(staffRaw));

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10">
      <div className="mb-10">
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Leads Control.</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] mt-2">Manage and distribute incoming enquiries</p>
      </div>

      <AssignLeadsForm 
        unassignedLeads={unassignedLeads} 
        salesStaff={salesStaff} 
      />
    </div>
  );
}