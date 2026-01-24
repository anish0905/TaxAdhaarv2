import mongoose from "mongoose";

const WithdrawalSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [100, 'Minimum withdrawal amount is ₹100'] // Safety check
  },
  upiId: { 
    type: String, 
    required: true,
    trim: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  // Payout proof ke liye Transaction ID zaroori hai
  transactionId: { 
    type: String,
    default: null 
  },
  adminRemarks: {
    type: String,
    default: ""
  },
  // Kab approve ya reject hua
  processedAt: {
    type: Date,
    default: null
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Isse automatic updatedAt aur createdAt mil jayenge
});

export const Withdrawal = mongoose.models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);