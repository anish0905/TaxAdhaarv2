"use client";
import { motion } from "framer-motion";

const badges = [
  { text: "INCOME TAX", sub: "DEPT" },
  { text: "GST", sub: "COUNCIL" },
  { text: "MSME", sub: "INDIA" },
  { text: "MCA", sub: "GOVT" },
  { text: "DIGITAL", sub: "INDIA" },
  { text: "STARTUP", sub: "INDIA" },
];

export default function TrustSlider() {
  // Hum array ko double kar denge taaki loop infinite lage
  const duplicatedBadges = [...badges, ...badges];

  return (
    <div className="bg-slate-50/50 backdrop-blur-md py-12 border-y border-slate-100 overflow-hidden relative">
      {/* Side Gradients for Fade Effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

      <motion.div
        className="flex gap-20 items-center whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"], // 0 se start hoke aadhe tak jayega phir repeat
        }}
        transition={{
          ease: "linear",
          duration: 25, // Jitna bada number, utni slow speed
          repeat: Infinity,
        }}
      >
        {duplicatedBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 opacity-40 grayscale contrast-150 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default"
          >
            <p className="font-black text-2xl md:text-3xl tracking-tighter text-slate-900">
              {badge.text} <span className="text-blue-600 font-normal italic">{badge.sub}</span>
            </p>
            {/* Dot Separator */}
            <div className="w-2 h-2 bg-blue-200 rounded-full ml-10"></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}