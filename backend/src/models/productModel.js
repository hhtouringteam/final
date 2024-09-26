// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",

//     },
//     brandId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Brand",

//     },
//     models: [
//       {
//         modelId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Vehicle",

//         },
//         itemCode: { type: String }, // Mã sản phẩm
//         specifications: {
//           size: { type: String }, // Kích thước
//           material: { type: String }, // Chất liệu
//           color: { type: String }, // Màu sắc
//           spokeCount: { type: Number }, // Số căm
//           weight: { type: Number }, // Trọng lượng
//         },
//         price: { type: Number, required: true, min: 0 }, // Giá, phải là số dương
//         discount: { type: Number, default: 0, min: 0, max: 100 }, // Phần trăm giảm giá, 0-100%
//         stock: { type: Number, default: 0, min: 0 }, // Số lượng hàng tồn kho, không được âm
//       },
//     ],
//     images: [
//       {
//         url: { type: String, required: true }, // URL hình ảnh
//         altText: { type: String }, // Mô tả ngắn về hình ảnh
//       },
//     ],
//     description: { type: String }, // Mô tả sản phẩm
//     status: {
//       type: String,
//       enum: ["available", "unavailable"],
//       default: "available",
//     }, // Tình trạng sản phẩm
//     ratings: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User",
//         },
//         rating: { type: Number, min: 1, max: 5 }, // Đánh giá từ 1 đến 5
//         comment: { type: String }, // Bình luận
//         createdAt: { type: Date, default: Date.now }, // Ngày đánh giá
//       },
//     ],
//   },
//   { timestamps: true }
// ); // Tự động thêm createdAt và updatedAt

// // Tạo một virtual field cho giá cuối cùng sau khi giảm giá
// productSchema.virtual("finalPrice").get(function () {
//   return this.models.map((model) => ({
//     finalPrice: model.price - model.price * (model.discount / 100),
//   }));
// });

// // Không cần Middleware vì timestamps sẽ tự động cập nhật updatedAt

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  itemCode: { type: String, default: "" }, // Không bắt buộc
  stock: { type: Number, default: 0 }, // Không bắt buộc, mặc định là 0
  imageUrl: { type: String, default: "" }, // Không bắt buộc

  specifications: {
    size: { type: String, default: "" }, // Không bắt buộc
    material: { type: String, default: "" }, // Không bắt buộc
    color: { type: String, default: "" }, // Không bắt buộc
    spokeCount: { type: Number, default: 0 }, // Không bắt buộc
    weight: { type: Number, default: 0 }, // Không bắt buộc
  }, // Thông số kỹ thuật
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
