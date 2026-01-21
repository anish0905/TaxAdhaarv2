import { CheckCircle2 } from "lucide-react";

export function TimelineStep({ done, label, active, icon }: { done: boolean; label: string; active: boolean; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10 group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white transition-all duration-700 shadow-lg ${
          done ? 'bg-emerald-500 text-white shadow-emerald-200/50' : 
          active ? 'bg-[#020617] text-blue-400 animate-pulse scale-110' : 'bg-white text-slate-300'
        }`}>
        {done ? <CheckCircle2 size={20} strokeWidth={3} /> : icon}
      </div>
      <div className="flex flex-col items-center">
        <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${active ? 'text-blue-600' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
          {label}
        </span>
        {active && <div className="w-4 h-1 bg-blue-600 rounded-full mt-1 animate-bounce" />}
      </div>
    </div>
  );
}