const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // Loại thông báo (đơn hàng, sản phẩm, người dùng, phản hồi)
  message: { type: String, required: true }, // Nội dung thông báo
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo
  isRead: { type: Boolean, default: false }, // Trạng thái đã đọc hay chưa
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID liên quan (nếu cần)
  isRead: { type: Boolean, default: false }, // Thêm trường này
});

module.exports = mongoose.model("Notification", notificationSchema);
