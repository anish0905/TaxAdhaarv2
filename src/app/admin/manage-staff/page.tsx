"use client"
import { registerUser } from "@/app/actions/register";
import { useState } from "react";

export default function RegisterPage() {
  const [msg, setMsg] = useState("");

  async function handleSubmit(formData: FormData) {
    const res = await registerUser(formData);
    if (res.error) setMsg(res.error);
    if (res.success) setMsg(res.success);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form action={handleSubmit} className="p-8 border rounded shadow-md w-96 flex flex-col gap-4">
        <h1 className="text-xl font-bold">TaxPortal Registration</h1>
        <input name="name" placeholder="Full Name" className="border p-2 rounded" required />
        <input name="email" type="email" placeholder="Email" className="border p-2 rounded" required />
        <input name="phone" placeholder="Phone Number" className="border p-2 rounded" required />
        <input name="password" type="password" placeholder="Password" className="border p-2 rounded" required />
        
        {/* Role Selection: Sirf Admin hi staff ke roles select karega baad mein */}
         <select name="role" className="border p-2 rounded">
          <option value="client">Client</option>
          <option value="sales">Sales (Call Center)</option>
          <option value="staff">Staff (CA Expert)</option>
          <option value="admin">Admin</option>
        </select>
       

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
        {msg && <p className="text-center text-sm mt-2">{msg}</p>}
      </form>
    </div>
  );
}