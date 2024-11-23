// models/installmentPaymentModel.js
const mongoose = require("mongoose");

const installmentPaymentSchema = new mongoose.Schema(
  {
    installmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Installment",
      required: true,
    },
    paymentNumber: { type: Number, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Paid",'Completed', 'Overdue'], default: "Pending" },
    paidDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstallmentPayment", installmentPaymentSchema);
