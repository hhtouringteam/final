const mongoose = require("mongoose");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const Vehicle = require("../../models/vehicleModel");

class baseController {
  constructor(model, pluralKey, singularKey) {
    this.model = model;
    this.pluralKey = pluralKey;
    this.singularKey = singularKey;
  }

  async getAll(req, res) {
    try {
      const items = await this.model.find();
      res.json({ [this.pluralKey]: items });
    } catch (error) {
      console.error("Error fetching items:", error);
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách", error });
    }
  }

  async create(req, res) {
    try {
      const { name } = req.body;

      // Kiểm tra nếu sản phẩm đã tồn tại với tên này
      const existingProduct = await this.model.findOne({ name });
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: "Sản phẩm với tên này đã tồn tại!" });
      }

      // Nếu không trùng, tiến hành thêm sản phẩm mới
      const data = req.body;
      const newProduct = new this.model({
        ...data, // Nhận tất cả dữ liệu từ req.body

        specifications: data.specifications, // Nhận và lưu trường specifications
      });
      console.log("....", newProduct);
      await newProduct.save();

      // Populate các trường liên kết trước khi trả về
      const populatedProduct = await this.model
        .findById(newProduct._id)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name description manufacturer year type engineSize"
        );

      res.status(201).json({ [this.singularKey]: populatedProduct });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra khi tạo sản phẩm mới",
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { categoryId, brandId, vehicleId, ...otherData } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
      }

      // Tìm sản phẩm hiện tại trong cơ sở dữ liệu
      const product = await Product.findById(id)
        .populate("categoryId")
        .populate("brandId")
        .populate("vehicleId");

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
      }

      // Kiểm tra nếu tên danh mục mới khác danh mục hiện tại
      let category;
      if (categoryId && categoryId !== product.categoryId.name) {
        category = await Category.findOne({ name: categoryId });
        if (!category) {
          category = new Category({ name: categoryId });
          await category.save();
        }
        // Xóa danh mục cũ nếu không còn sản phẩm nào tham chiếu đến
        if (
          (await Product.countDocuments({
            categoryId: product.categoryId._id,
          })) === 1
        ) {
          await Category.findByIdAndDelete(product.categoryId._id);
        }
      } else {
        category = product.categoryId; // Giữ nguyên danh mục cũ
      }

      // Kiểm tra nếu tên thương hiệu mới khác thương hiệu hiện tại
      let brand;
      if (brandId && brandId !== product.brandId.name) {
        brand = await Brand.findOne({ name: brandId });
        if (!brand) {
          brand = new Brand({ name: brandId });
          await brand.save();
        }
        // Xóa thương hiệu cũ nếu không còn sản phẩm nào tham chiếu đến
        if (
          (await Product.countDocuments({ brandId: product.brandId._id })) === 1
        ) {
          await Brand.findByIdAndDelete(product.brandId._id);
        }
      } else {
        brand = product.brandId; // Giữ nguyên thương hiệu cũ
      }

      // Kiểm tra nếu tên phương tiện mới khác phương tiện hiện tại
      let vehicle;
      if (vehicleId && vehicleId !== product.vehicleId.name) {
        vehicle = await Vehicle.findOne({ name: vehicleId });
        if (!vehicle) {
          vehicle = new Vehicle({ name: vehicleId });
          await vehicle.save();
        }
        // Xóa phương tiện cũ nếu không còn sản phẩm nào tham chiếu đến
        if (
          (await Product.countDocuments({
            vehicleId: product.vehicleId._id,
          })) === 1
        ) {
          await Vehicle.findByIdAndDelete(product.vehicleId._id);
        }
      } else {
        vehicle = product.vehicleId; // Giữ nguyên phương tiện cũ
      }

      // Cập nhật sản phẩm với ObjectId của danh mục, thương hiệu và phương tiện
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
          ...otherData,
          categoryId: category._id,
          brandId: brand._id,
          vehicleId: vehicle._id,
        },
        { new: true }
      );

      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Có lỗi xảy ra khi cập nhật", error });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }

      const deletedItem = await this.model.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({ message: "Không tìm thấy tài nguyên" });
      }

      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: "Có lỗi xảy ra khi xóa", error });
    }
  }
  async getProductById(req, res) {
    try {
      const { id } = req.params; // Lấy id từ URL

      // Tìm sản phẩm theo id và populate các liên kết như categoryId, brandId, vehicleId
      const product = await Product.findById(id)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate("vehicleId", "name manufacturer year type engineSize");

      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
      }

      // Trả về sản phẩm đã tìm thấy
      res.json({ product });
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
    }
  }
  
}

module.exports = baseController;
