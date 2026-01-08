import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { setOrderPrice } from "@/app/actions/setPrice";

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  await connectDB();
  const order = await Order.findById(params.id);

  if (!order) return <div className="p-10 text-black">Order Not Found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">{order.clientName}</h1>
          <p>Service: {order.serviceType} | Phone: {order.clientPhone}</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-4 text-black border-b pb-2">Finalize Pricing</h2>
          <form action={setOrderPrice} className="flex flex-col gap-4 max-w-sm">
            <input type="hidden" name="orderId" value={order._id.toString()} />
            
            <div>
              <label className="block font-bold text-gray-700">Set Service Charges (₹)</label>
              <input 
                type="number" 
                name="amount" 
                className="w-full border p-3 rounded text-black font-bold"
                placeholder="Ex: 1500"
                required
              />
            </div>

            <button type="submit" className="bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition">
              Verify & Send Payment Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}