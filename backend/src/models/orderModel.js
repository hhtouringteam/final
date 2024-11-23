const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderCode: {
      type: Number,
      unique: true,
      required: true,
    },
    app_trans_id: {
      type: String,
      unique: true,
      required: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPaid: {
      type: Number,
      default: 0,
    },
  
    installmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Installment" },
    billingInfo: {
      username: String,
      country: String,
      streetAddress: String,
      phone: String,
      email: String,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "ZaloPay", "PayOS"],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: [
          "Pending",
          "pending",
          "Paid",
          "paid",
          "Failed",
          "failed",
          "CANCELED",
          "cancelled",
          "Partial",
        ],
        message: "{VALUE} is not a valid payment status",
      },
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
