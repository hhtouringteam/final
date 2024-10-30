const mongoose = require("mongoose");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const Vehicle = require("../../models/vehicleModel");
class CustomerController {
  // Hàm chung để lấy sản phẩm theo điều kiện
  getProductsByCondition = async (req, res, condition = {}, limit = 0) => {
    try {
      const products = await Product.find(condition)
        .limit(limit)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name description manufacturer year type engineSize"
        )
        .lean();

      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching products", error: error.message });
    }
  };

  getAllProducts = async (req, res) => {
    return this.getProductsByCondition(req, res, {}, 0);
  };

  // Lấy sản phẩm đặc biệt
  getSpecialProducts = async (req, res) => {
    const condition = {
      category: { $in: ["motorcycle shocks", "motorcycle shockss"] },
    };
    const limit = 3;
    return this.getProductsByCondition(req, res, condition, limit);
  };

  // Lấy sản phẩm nổi bật
  getFeaturedProducts = async (req, res) => {
    const limit = 8;
    return this.getProductsByCondition(req, res, {}, limit);
  };

  // Lấy sản phẩm banner
  getBannerProducts = async (req, res) => {
    const limit = 2;
    return this.getProductsByCondition(req, res, {}, limit);
  };

  // Lấy sản phẩm xu hướng
  getTrendingProducts = async (req, res) => {
    const limit = 6;
    return this.getProductsByCondition(req, res, {}, limit);
  };

  // Lấy chi tiết một sản phẩm theo ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: "Product ID is required" });
      }
      const product = await Product.findById(id)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name description manufacturer year type imageUrl engineSize"
        )

        .lean();

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching product details",
        error: error.message,
      });
    }
  }

  // Lọc sản phẩm theo danh mục hoặc thương hiệu
  async getProductsByFilter(req, res) {
    try {
      const { categoryId, brandId, vehicleId } = req.query;

      const filter = {
        ...(categoryId && { categoryId: mongoose.Types.ObjectId(categoryId) }),
        ...(brandId && { brandId: mongoose.Types.ObjectId(brandId) }),
        ...(vehicleId && { vehicleId: mongoose.Types.ObjectId(vehicleId) }),
      };

      const products = await Product.find(filter)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name description manufacturer year type engineSize"
        )
        .lean();

      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error filtering products", error: error.message });
    }
  }
}

module.exports = new CustomerController();
