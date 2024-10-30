// models/installmentPaymentModel.js
const mongoose = require("mongoose");

const installmentPaymentSchema = new mongoose.Schema(
  {
    installmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installment",
      required: true,
    },
    paymentNumber: { type: Number, required: true }, // Số thứ tự kỳ thanh toán
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true }, // Ngày đến hạn
    paymentDate: { type: Date },
    status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstallmentPayment", installmentPaymentSchema);
