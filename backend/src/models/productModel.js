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
  stock: { type: Number }, // Không bắt buộc, mặc định là 0
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
