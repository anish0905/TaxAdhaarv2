import connectDB from "@/lib/db";
import { User } from "@/models/User";
import UploadForm from "./UploadForm";
export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await connectDB();

  const salesTeam = await User.find({ role: "sales" }).lean();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
          Distribute Leads
        </h1>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">
          Bulk Import & Auto-Assign to Sales Team
        </p>
      </div>

      <UploadForm salesTeam={JSON.parse(JSON.stringify(salesTeam))} />
    </div>
  );
}
