import { getClients } from "@/app/actions/adminActions";
import Link from "next/link";
import { User, Phone, Mail, MessageCircle, ArrowLeft, ArrowRight, Search } from "lucide-react";

export default async function AdminClientDirectory({ searchParams }: { searchParams: Promise<{ page: string }> }) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  
  // Destructure with default values to avoid 'undefined' error
  const { clients = [], totalPages = 1 } = await getClients(currentPage, 8);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Client <span className="text-blue-600">Database</span>
            </h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-3">Manage and support your registered clients</p>
          </div>
          
          <div className="relative w-full md:w-80">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input type="text" placeholder="Search by name or phone..." className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-blue-500 shadow-sm" />
          </div>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clients.length > 0 ? (
            clients.map((client: any) => (
              <div key={client._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all group">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black italic mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {client.name?.charAt(0)}
                </div>
                
                <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 truncate">{client.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic">Since {new Date(client.createdAt).toLocaleDateString()}</p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone size={14} className="text-blue-500" />
                    <span className="text-xs font-bold">{client.phone || "No Phone"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail size={14} className="text-blue-500" />
                    <span className="text-xs font-bold truncate">{client.email}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-6 border-t border-slate-50">
                  <a href={`https://wa.me/${client.phone}`} target="_blank" className="flex-1 bg-emerald-50 text-emerald-600 p-3 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><MessageCircle size={18} /></a>
                  <a href={`tel:${client.phone}`} className="flex-1 bg-blue-50 text-blue-600 p-3 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><Phone size={18} /></a>
                  <Link href={`/dashboard/admin/clients/${client._id}`} className="flex-1 bg-slate-900 text-white p-3 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all"><User size={18} /></Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center py-20 font-black text-slate-300 uppercase italic">No clients found</p>
          )}
        </div>

        {/* Pagination Section - Fixed 'undefined' issue */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-4">
            <Link 
              href={`/dashboard/admin/clients?page=${currentPage - 1}`}
              className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm ${currentPage <= 1 ? 'pointer-events-none opacity-20' : 'hover:bg-blue-600 hover:text-white transition-all'}`}
            >
              <ArrowLeft size={20} />
            </Link>
            
            <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 font-black text-xs uppercase tracking-widest">
              Page {currentPage} <span className="text-slate-300 mx-2">/</span> {totalPages}
            </div>

            <Link 
              href={`/dashboard/admin/clients?page=${currentPage + 1}`}
              className={`p-4 rounded-2xl bg-white border border-slate-200 shadow-sm ${currentPage >= (totalPages || 0) ? 'pointer-events-none opacity-20' : 'hover:bg-blue-600 hover:text-white transition-all'}`}
            >
              <ArrowRight size={20} />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}