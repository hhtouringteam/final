const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true }, // Email người nhận (admin)
  subject: { type: String, required: true }, // Tiêu đề email
  content: { type: String, required: true }, // Nội dung email
  sentAt: { type: Date, default: Date.now }, // Thời gian gửi
  relatedOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Tham chiếu đến đơn hàng
  customerName: { type: String }, // Tên khách hàng
  customerEmail: { type: String }, // Email khách hàng
  products: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ], // Danh sách sản phẩm
  totalPrice: { type: Number }, // Tổng giá sản phẩm
  billingInfo: {
    username: String,
    email: String,
    phone: String,
    streetAddress: String,
    country: String,
  }, // Thông tin khách hàng
  isRead: { type: Boolean, default: false },
});

module.exports = mongoose.model("EmailLog", emailLogSchema);
