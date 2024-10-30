// models/installmentModel.js
const mongoose = require("mongoose");

const installmentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  plan: { type: String, enum: ["3", "6", "12"], required: true }, // Kỳ hạn trả góp
  interestRate: { type: Number, required: true }, // Lãi suất áp dụng
  monthlyPayment: { type: Number, required: true }, // Số tiền trả hàng tháng
  totalInterest: { type: Number, required: true }, // Tổng tiền lãi
  totalAmount: { type: Number, required: true }, // Tổng số tiền phải trả (gốc + lãi)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Installment", installmentSchema);
