import connectDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ClientDashboard() {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  // Client ke phone number se uske saare orders dhundna
  const myOrders = await Order.find({ clientPhone: session.user.email }).sort({ createdAt: -1 });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {session.user.name}</h1>
        <p className="text-slate-500">Apne active orders aur payment status yahan check karein.</p>
      </div>

      <div className="grid gap-6">
        {myOrders.length === 0 ? (
          <div className="text-center p-20 bg-white rounded-3xl border border-dashed">
            <p className="text-slate-400">Abhi tak koi active order nahi mila.</p>
          </div>
        ) : (
          myOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-3xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{order.serviceType}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Order ID: #{order._id.toString().slice(-6)}</h3>
                <p className="text-slate-500 text-sm">Status: <span className="font-bold text-slate-700 capitalize">{order.status.replace('_', ' ')}</span></p>
              </div>

              <div className="flex items-center gap-4">
                {/* Payment Logic */}
                {order.isVerified && order.paymentStatus === 'pending' && (
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase">Amount to Pay</p>
                    <p className="text-2xl font-black text-slate-900">₹{order.quotedAmount}</p>
                    <Link 
                      href={`/checkout/${order._id}`}
                      className="inline-block mt-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                      Pay Now
                    </Link>
                  </div>
                )}

                {order.paymentStatus === 'paid' && (
                  <span className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold">
                    Paid Successfully ✅
                  </span>
                )}

                <Link 
                  href={`/dashboard/order/${order._id}`}
                  className="bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}