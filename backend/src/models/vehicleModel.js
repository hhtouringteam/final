const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Tên xe, yêu cầu và phải là duy nhất
    description: { type: String },
    manufacturer: { type: String }, // Nhà sản xuất
    year: { type: Number }, // Năm sản xuất
    type: {
      type: String,
    },
    engineSize: { type: String }, // Dung tích động cơ (ví dụ: 150cc)
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Vehicle", vehicleSchema);
