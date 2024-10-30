// models/Payment.js
const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    installment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installment",
      required: true,
    },
    order: {
      // Thêm liên kết trực tiếp đến Order để dễ truy vấn
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ["PayOS", "Zalo Pay", "COD"],
      required: true,
    },
    payment_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Thành công", "Thất bại"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
