import connectDB from "@/lib/db";
import { Order } from "@/models/Order";

export default async function AdminHome() {
  await connectDB();
  
  // Stats nikalna
  const totalLeads = await Order.countDocuments();
  const pendingPayments = await Order.countDocuments({ paymentStatus: 'pending', isVerified: true });
  const completedTasks = await Order.countDocuments({ status: 'completed' });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-black">Business Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm">Total Leads in System</p>
          <h3 className="text-3xl font-bold text-black">{totalLeads}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm">Awaiting Payments</p>
          <h3 className="text-3xl font-bold text-black">{pendingPayments}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Completed Filings</p>
          <h3 className="text-3xl font-bold text-black">{completedTasks}</h3>
        </div>
      </div>

      {/* Call Center Performance Preview (Coming Soon) */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-black">Call Center Activity</h2>
        <p className="text-gray-500">Yahan sales team ki report dikhegi...</p>
      </div>
    </div>
  );
}