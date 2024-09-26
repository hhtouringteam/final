const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Tên thương hiệu
  description: { type: String }, // Mô tả cho thương hiệu

  establishedYear: { type: Number }, // Năm thành lập thương hiệu
  country: { type: String }, // Quốc gia của thương hiệu
  website: { type: String }, // URL website chính thức
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt mà không cần middleware

module.exports = mongoose.model("Brand", brandSchema);
