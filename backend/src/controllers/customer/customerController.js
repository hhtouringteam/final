const Product = require("../../models/productModel");

class CustomerController {
  // Lấy danh sách tất cả sản phẩmasync getAllProducts(req, res) {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find()
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name  description manufacturer year type engineSize"
        );

      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  }
  // Lấy chi tiết một sản phẩm theo ID
  async getProductById(req, res) {
    try {
      const { id } = req.params; // Lấy id từ params
      const product = await Product.findById(id)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name  description manufacturer year type engineSize"
        );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching product details", error });
    }
  }

  // Lọc sản phẩm theo danh mục hoặc thương hiệu
  async getProductsByFilter(req, res) {
    try {
      const { categoryId, brandId } = req.query; // Lấy các tham số từ query

      let filter = {};
      if (categoryId) {
        // Chuyển categoryId thành ObjectId
        filter.categoryId = mongoose.Types.ObjectId(categoryId);
      }
      if (brandId) {
        // Chuyển brandId thành ObjectId
        filter.brandId = mongoose.Types.ObjectId(brandId);
      }

      const products = await Product.find(filter)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name  description manufacturer year type engineSize"
        );

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error filtering products", error });
    }
  }

  // Tìm kiếm sản phẩm theo tên
  async searchProductsByName(req, res) {
    try {
      const { name } = req.query; // Lấy tên sản phẩm từ query
      const products = await Product.find({
        name: { $regex: name, $options: "i" }, // Tìm kiếm tên (không phân biệt hoa thường)
      })
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name  description manufacturer year type engineSize"
        );

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error searching products", error });
    }
  }
}

module.exports = new CustomerController();
