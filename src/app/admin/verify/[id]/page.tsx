import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { setOrderPrice } from "@/app/actions/setPrice";
import { notFound } from "next/navigation";

// Params ko Promise type mein define karein (Next.js 15 ke liye)
export default async function SetPricePage({ params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  
  // Params ko await karein
  const { id } = await params;

  const order = await Order.findById(id);

  if (!order) return notFound();

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-4">Set Final Pricing</h2>
        
        <div className="mb-8 space-y-2">
          <p className="text-sm text-slate-500 uppercase font-bold tracking-widest">Client Name</p>
          <p className="text-xl font-bold text-blue-600">{order.clientName}</p>
          <p className="text-sm text-slate-600">Service: <span className="font-bold">{order.serviceType}</span></p>
        </div>

        <form action={setOrderPrice} className="space-y-6">
          <input type="hidden" name="orderId" value={order._id.toString()} />
          
          <div className="space-y-2">
            <label className="block font-bold text-slate-700">Service Charges (₹)</label>
            <input 
              type="number" 
              name="amount" 
              placeholder="e.g. 1500"
              className="w-full border-2 p-4 rounded-2xl text-2xl font-black text-black bg-slate-50 focus:border-blue-500 outline-none transition"
              required
            />
            <p className="text-xs text-slate-400">Ye amount client ko uske dashboard par dikhega.</p>
          </div>

          <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black shadow-xl transition active:scale-95">
            Approve & Notify Client
          </button>
        </form>
      </div>
    </div>
  );
}