import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  docType: String,
 uploadedBy: { 
    type: String, 
    enum: ['client', 'staff', 'admin'], 
    default: 'client' 
  },
  uploadedAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // --- LEAD & ASSIGNMENT ---
  assignedSalesId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  leadStatus: { 
    type: String, 
    enum: ['pending', 'called', 'confirmed', 'rejected'], 
    default: 'pending' 
  },

  // --- SERVICE DETAILS ---
  serviceType: String,   // e.g., "INCOME TAX SERVICES"
  variantId: String,     // e.g., "itr-filing" (Naya: Variant track karne ke liye)
  
  // --- DYNAMIC FORM ANSWERS ---
  // Ye field client ke saare questions ke answers store karegi
  metadata: { 
    type: Map, 
    of: mongoose.Schema.Types.Mixed, 
    default: {} 
  },

  // --- CLIENT INFO ---
  clientName: String,
  clientPhone: String, // Email or Phone identifier

  // --- BILLING & PAYMENT ---
  quotedAmount: { type: Number, default: 0 },
paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'verification_pending', 'paid', 'partially_paid', 'refunded'], 
    default: 'unpaid' 
  },
  paymentDate: { type: Date },
  
  billing: {
    taxAmount: { type: Number, default: 0 },
    serviceCharge: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    isInvoiceGenerated: { type: Boolean, default: false }, // Server action support
    walletDiscountApplied: { type: Number, default: 0 },
  },

  // Add this to OrderSchema
razorpayOrderId: { type: String, default: null },
// Nayi field payment proof ke liye
 manualPaymentScreenshot: { type: String, default: null },
  // --- ASSETS ---
  documents: [DocumentSchema],

  // --- WORKFLOW STATUS ---
  status: { 
    type: String, 
    enum: [
      'new_lead', 
      'under_review', 
      'payment_pending', 
      'processing', 
      'completed', 
      'rejected'
    ], 
    default: 'new_lead' 
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now } // Tracking for modifications
});

// Middleware to update the 'updatedAt' field on save
OrderSchema.pre('save', function() {
  this.updatedAt = new Date();
  // Next ki zaroori nahi hai agar aap sirf field update kar rahe hain
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);