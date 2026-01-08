import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import SalesTable from "./SalesTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SalesDashboardPage() {
  await connectDB();
  
  // 1. Logged-in user ka session lein
  const session = await getServerSession(authOptions);

  // 2. Agar login nahi hai toh login page par bhejein
  if (!session || !session.user) {
    redirect("/login");
  }

  // 3. User ID nikaalein (Ensure karein ki nextauth mein aapne id pass ki hai)
  const salesId = session.user.id; 

  // 4. Database se sirf wahi leads laayein jo is Sales Person ko assigned hain
  const leads = await Order.find({ 
    assignedSalesId: salesId, // Filter by Logged-in User ID
    leadStatus: { $in: ['pending', 'called', 'interested'] } 
  }).sort({ createdAt: -1 });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">My Calling Queue</h1>
        <p className="text-slate-500 text-sm">Welcome, {session.user.name}. Aapke liye {leads.length} leads assigned hain.</p>
      </div>

      {/* Leads Table */}
      <SalesTable leads={JSON.parse(JSON.stringify(leads))} />
    </div>
  );
}