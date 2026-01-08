import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  publicId: String,
  uploadedBy: { type: String, enum: ['client', 'admin', 'sales'] },
  uploadedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  // Client Details
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
serviceType: { 
    type: String, 
    // enum hata diya taaki koi bhi string accept ho jaye
    default: 'OTHER' 
  },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  // 1. Sales Phase (Excel Leads)
  leadStatus: { 
    type: String, 
    enum: ['pending', 'called', 'interested', 'not_interested', 'confirmed'], 
    default: 'pending' 
  },
  assignedSalesId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Call Center Staff
  salesRemarks: String,

  // 2. Verification & Pricing Phase
  isVerified: { type: Boolean, default: false },
  quotedAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },

  // 3. Document Management (Hybrid)
  documents: [DocumentSchema],

  // 4. Execution Phase
  assignedStaffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // CA Staff
status: { 
    type: String, 
    // Yahan 'new_lead' aur 'docs_pending' add karna zaroori hai
    enum: ['new_lead', 'docs_pending', 'submitted', 'verified', 'assigned', 'in-progress', 'completed'], 
    default: 'new_lead' 
  },

  finalReceiptUrl: String, // Filing ke baad acknowledgment PDF
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);