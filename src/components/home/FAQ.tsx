"use client";
import { useState } from "react";

const faqs = [
  { q: "ITR file karne ke liye kaunse documents chahiye?", a: "Aapko sirf apna PAN card, Aadhaar card aur Form 16 ki zaroorat hoti hai." },
  { q: "Kya mera data secure rahega?", a: "Ji haan, hum bank-grade AES-256 encryption use karte hain aapke data ko safe rakhne ke liye." },
  { q: "Refund aane mein kitna samay lagta hai?", a: "Filing ke baad aamtaur par 15-45 dino mein refund aapke bank account mein aa jata hai." }
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white max-w-4xl mx-auto px-6">
      <h2 className="text-4xl font-black text-center mb-12 text-black">Frequently Asked Questions</h2>
      <div className="space-y-4 text-blue-950">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <button 
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full p-6 text-left font-bold flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition"
            >
              {faq.q}
              <span>{open === i ? "−" : "+"}</span>
            </button>
            {open === i && <div className="p-6 text-slate-600 bg-white border-t border-slate-100">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}