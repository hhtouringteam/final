const baseController = require("./baseController");
const Product = require("../../models/productModel");

const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");
const Vehicle = require("../../models/vehicleModel");
class adminProductController extends baseController {
  constructor() {
    super(Product, "products", "product"); // Truyền model, pluralKey, singularKey
  }

  // async getAll(req, res) {
  //   try {
  //     const { name, stock } = req.query;

  //     // Tạo đối tượng filter
  //     let filter = {};

  //     // Tìm theo tên sản phẩm
  //     if (name) {
  //       filter.name = { $regex: name, $options: "i" }; // Tìm theo chuỗi có chứa 'name', không phân biệt hoa thường
  //     }

  //     // Tìm theo số lượng tồn kho
  //     if (stock) {
  //       filter.stock = Number(stock); // Tìm theo số lượng tồn kho (đảm bảo chuyển stock thành kiểu số)
  //     }

  //     // Truy vấn dữ liệu từ MongoDB với các bộ lọc đã tạo
  //     const products = await this.model
  //       .find(filter)
  //       .populate("categoryId", "name description")
  //       .populate("brandId", "name description")
  //       .populate("vehicleId", "name description");

  //     // Trả về danh sách sản phẩm
  //     res.json({ products });
  //   } catch (error) {
  //     console.error("Error fetching products:", error);
  //     res.status(500).json({ message: "Error fetching products", error });
  //   }
  // }
  async getAll(req, res) {
    try {
      const { name, category, brand, vehicle, priceMin, priceMax } = req.query;

      // Tạo đối tượng filter
      let filter = {};

      // Tìm theo tên sản phẩm
      if (name) {
        filter.name = { $regex: name, $options: "i" }; // Tìm theo chuỗi có chứa 'name', không phân biệt hoa thường
      }

      // Tìm theo danh mục
      if (category) {
        // Giả sử category được gửi dưới dạng chuỗi liệt kê các ID, phân tách bằng dấu phẩy
        const categoryIds = category.split(",").map((id) => id.trim());
        filter.categoryId = { $in: categoryIds };
      }

      // Tìm theo thương hiệu
      if (brand) {
        const brandIds = brand.split(",").map((id) => id.trim());
        filter.brandId = { $in: brandIds };
      }

      // Tìm theo phương tiện
      if (vehicle) {
        const vehicleIds = vehicle.split(",").map((id) => id.trim());
        filter.vehicleId = { $in: vehicleIds };
      }

      // Tìm theo khoảng giá
      if (priceMin || priceMax) {
        filter.price = {};
        if (priceMin) {
          filter.price.$gte = Number(priceMin);
        }
        if (priceMax) {
          filter.price.$lte = Number(priceMax);
        }
      }

      // Truy vấn dữ liệu từ MongoDB với các bộ lọc đã tạo
      const products = await this.model
        .find(filter)
        .populate("categoryId", "name description")
        .populate("brandId", "name description establishedYear country website")
        .populate(
          "vehicleId",
          "name description manufacturer year type engineSize"
        );

      // Trả về danh sách sản phẩm
      res.json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products", error });
    }
  }

  // Nếu cần, override phương thức create để thêm populate
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
}

module.exports = new adminProductController();
