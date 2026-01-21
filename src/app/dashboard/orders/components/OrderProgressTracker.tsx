import { FileText, Clock, IndianRupee, Activity, ShieldCheck } from "lucide-react";
import { TimelineStep } from "./TimelineStep";

export function OrderProgressTracker({ status, paymentStatus }: { status: string, paymentStatus: string }) {
  // --- Core Status Flags ---
  const isReviewing = status === 'under_review';
  const isPaymentPending = status === 'payment_pending' && paymentStatus !== 'paid';
  const isProcessing = status === 'processing' || (paymentStatus === 'paid' && status !== 'completed');
  const isCompleted = status === 'completed';

  // --- Logical "Done" states for each step ---
  // 1. Review is 'done' if we have moved past payment_pending or are processing/completed
  const reviewDone = isPaymentPending || isProcessing || isCompleted;
  
  // 2. Payment is 'done' if paymentStatus is 'paid' OR we are already in processing/completed
  const paymentDone = paymentStatus === 'paid' || isProcessing || isCompleted;
  
  // 3. Filing is 'done' only when the final status is 'completed'
  const filingDone = isCompleted;

  // --- Dynamic Progress Bar Width ---
  const getProgressWidth = () => {
    if (isCompleted) return 'w-full';
    if (isProcessing) return 'w-[75%]';
    if (isPaymentPending) return 'w-[50%]';
    if (isReviewing) return 'w-[25%]';
    return 'w-0';
  };

  return (
    <div className="flex-1 p-8 flex flex-col justify-center bg-slate-50/50 rounded-[3.5rem] my-4 mx-4 xl:mx-0 relative border border-slate-100/50 group/tracker">
      <div className="relative flex justify-between max-w-xl mx-auto w-full px-2">
        
        {/* Background Track */}
        <div className="absolute top-6 left-0 right-0 h-[4px] bg-slate-200/60 -z-0 rounded-full overflow-hidden">
          {/* Animated Progress Fill */}
          <div 
            className={`h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(37,99,235,0.3)] ${getProgressWidth()}`}
          />
        </div>
        
        {/* Step 1: Documents (Always Done as it's the starting point) */}
        <TimelineStep 
          done={true} 
          label="Docs" 
          active={false} 
          icon={<FileText size={16} />} 
        />

        {/* Step 2: Review */}
        <TimelineStep 
          done={reviewDone} 
          label="Review" 
          active={isReviewing} 
          icon={<Clock size={16} />} 
        />

        {/* Step 3: Payment */}
        <TimelineStep 
          done={paymentDone} 
          label="Payment" 
          active={isPaymentPending} 
          icon={<IndianRupee size={16} />} 
        />

        {/* Step 4: Filing/Processing */}
        <TimelineStep 
          done={filingDone} 
          label="Filing" 
          active={isProcessing} 
          icon={<Activity size={16} />} 
        />

        {/* Step 5: Completed */}
        <TimelineStep 
          done={isCompleted} 
          label="Done" 
          active={false} 
          icon={<ShieldCheck size={16} />} 
        />

      </div>
      
      {/* Sub-label for extra context (Optional) */}
      <div className="mt-6 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-0 group-hover/tracker:opacity-100 transition-opacity">
          Real-time Status: <span className="text-blue-600">{status.replace(/_/g, " ")}</span>
        </p>
      </div>
    </div>
  );
}