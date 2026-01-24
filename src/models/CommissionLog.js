import mongoose from "mongoose";

const CommissionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true }, // 5, 3, ya 2
  level: { type: String, enum: ['direct', 'level_2', 'level_3'] },
  serviceType: { type: String }, // GST, ITR etc.
  createdAt: { type: Date, default: Date.now }
});

export const CommissionLog = mongoose.models.CommissionLog || mongoose.model("CommissionLog", CommissionLogSchema);