export default function LeadUpdateForm({ lead }: { lead: any }) {
  return (
    <form action={updateLeadDetails} className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm">
      <input type="hidden" name="id" value={lead._id} />
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-500">CLIENT NAME</label>
          <input name="name" defaultValue={lead.clientName} className="w-full border p-2 rounded" />
        </div>
  <div>
  <label className="text-xs font-bold text-gray-500 uppercase">PHONE NO</label>
<input 
  key={lead._id} // <--- Ye line add karein, isse form refresh ho jayega
  type="text"
  name="phone" 
  defaultValue={lead.clientPhone || ""} 
  className="w-full border p-2 rounded text-black bg-white" 
  required 
/>
</div>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">SELECT SERVICE (BUSINESS TYPE)</label>
        <select name="service" defaultValue={lead.serviceType} className="w-full border p-2 rounded">
          <option value="GST">GST Registration/Return</option>
          <option value="ITR">ITR Filing</option>
          <option value="FSSAI">Food License (FSSAI)</option>
          <option value="MSME">MSME/Udyam</option>
          <option value="COMPANY">Company Registration</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">SALES COMMENT (REMARK)</label>
        <textarea name="comment" placeholder="Client se kya baat hui?" className="w-full border p-2 rounded h-20" />
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500">CALL STATUS</label>
        <select name="status" className="w-full border p-2 rounded font-bold bg-yellow-50">
          <option value="pending">Pending (Call Nahi Hua)</option>
          <option value="called">Called (Baat Chal Rahi Hai)</option>
          <option value="interested">Interested (Docs Mangwaye Hain)</option>
          <option value="not_interested">Not Interested (Junk Lead)</option>
          <option value="confirmed">✅ Confirmed (Execution ke liye Ready)</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">
        Update & Save Lead
      </button>
    </form>
  );
}