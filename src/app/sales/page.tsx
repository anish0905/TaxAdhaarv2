// src/app/sales/dashboard/page.tsx
import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import SalesTable from "./SalesTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Types } from "mongoose";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function SalesDashboardPage() {
  await connectDB();

  // 1️⃣ Get logged-in user session
  const session = await getServerSession(authOptions);

  // 2️⃣ Redirect to login if not logged in
  if (!session || !session.user) {
    redirect("/login");
  }

  // 3️⃣ Logged-in Sales ID
  const salesId = session.user.id;

  // 4️⃣ Fetch all leads assigned to this sales user
  // ✅ Convert salesId to ObjectId for proper MongoDB matching
  const leads = await Order.find({
    assignedSalesId: new Types.ObjectId(salesId),
    leadStatus: { $in: ["pending", "called", "interested", "assigned"] }, // include "assigned"
  }).sort({ createdAt: -1 });

  // 5️⃣ Render page
  return (
    <div className="p-6 mt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">My Calling Queue</h1>
        <p className="text-slate-500 text-sm">
          Welcome, {session.user.name}. You have {leads.length} leads assigned.
        </p>
      </div>

      {/* Leads Table */}
      <SalesTable leads={JSON.parse(JSON.stringify(leads))} />
    </div>
  );
}
