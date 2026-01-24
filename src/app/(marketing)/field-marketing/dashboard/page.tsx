import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { CommissionLog } from "@/models/CommissionLog"; // Log model import karein
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import MarketingDashboard from "../components/MarketingDashboard";


export default async function Page() {
  // 1. Session check
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  await connectDB();

  // 2. Fresh User Data (Agent Profile)
  const userRaw = await User.findById(session.user.id).lean();

  if (!userRaw) {
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">
        Agent Profile Not Found
      </div>
    );
  }

  // 3. TEAM DATA: Is agent ke code se kitne log registered hain
  // Hum User collection mein 'referredBy' field match kar rahe hain
  const teamRaw = await User.find({ referredBy: userRaw.referralCode })
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();

  // 4. COMMISSION LOGS: Is agent ko kitna paisa mila
  const logsRaw = await CommissionLog.find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  // 5. Serialization (MongoDB Objects to Plain JSON)
  const user = JSON.parse(JSON.stringify(userRaw));
  const team = JSON.parse(JSON.stringify(teamRaw));
  const logs = JSON.parse(JSON.stringify(logsRaw));

  // 6. Dashboard ko saara data pass karein
  return (
    <div className="p-2 md:p-6">
       <MarketingDashboard 
          user={user} 
          team={team} 
          logs={logs} 
       />
    </div>
  );
}