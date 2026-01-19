import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  docType: String,
  uploadedBy: { type: String, default: 'client' },
  uploadedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Nayi fields jo aap use kar rahe hain:
  assignedSalesId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Ye 'User' model se link hoga
    default: null 
  },
  leadStatus: { 
    type: String, 
    enum: ['pending', 'called', 'confirmed', 'rejected'], 
    default: 'pending' 
  },
  quotedAmount: { type: Number, default: 0 },
  paymentStatus: { type: String, default: 'unpaid' },
  paymentDate: { type: Date },
  // Yahan tak nayi fields khatam
  serviceType: String,
  clientName: String,
  clientPhone: String,
  billing: {
    taxAmount: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 }
  },
  documents: [DocumentSchema],
status: { 
  type: String, 
  enum: [
    'new_lead', 
    'under_review', 
    'payment_pending', 
    'processing', // <--- Payment ke baad Staff yahan kaam karega
    'completed', 
    'rejected'
  ], 
  default: 'new_lead' 
},
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);