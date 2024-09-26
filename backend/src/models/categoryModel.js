const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true }, // Tên danh mục
    description: { type: String }, // Mô tả cho danh mục
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Danh mục cha, tham chiếu đến chính Category
      default: null, // Nếu không có danh mục cha, giá trị mặc định là null
    },
  },
  { timestamps: true }
); // Tự động thêm createdAt và updatedAt

module.exports = mongoose.model("Category", categorySchema);
