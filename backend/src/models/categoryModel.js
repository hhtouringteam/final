const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true }, // Tên danh mục
    description: { type: String }, // Mô tả cho danh mục
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Category", categorySchema);
