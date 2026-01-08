import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import AssignLeadsForm from "@/components/admin/AssignLeadsForm";

export default async function AdminManageLeads() {
  await connectDB();

  // Data fetch as plain objects
  const leadsRaw = await Order.find({ assignedSalesId: { $exists: false } }).sort({ createdAt: -1 }).lean();
  const staffRaw = await User.find({ role: 'sales' }).lean();

  // Next.js client components ko pass karne ke liye clean JSON
  const unassignedLeads = JSON.parse(JSON.stringify(leadsRaw));
  const salesStaff = JSON.parse(JSON.stringify(staffRaw));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 italic">Manage & Assign Leads</h1>
        <p className="text-slate-500 font-medium">Unassigned leads ko select karein aur staff ko allot karein.</p>
      </div>

      <AssignLeadsForm 
        unassignedLeads={unassignedLeads} 
        salesStaff={salesStaff} 
      />
    </div>
  );
}