// const Product = require("../models/Product");

// class ProductsController {
//   async get(req, res, next) {
//     let res;
//     const { limit, category } = req.query;
//     const { id } = req.params;

//     if (id) {
//     }

//     if (limit) {
//       res = await Product.find({}).limit(limit);
//     } else if (category) {
//       res = await Product.find({
//         category: { $in: [category] },
//       }).limit(limit);
//     } else {
//       res = await Product.find({});
//     }

//     return res.json(res);

//     // try {
//     //   const product = await Product.find({});
//     //   res.json(product);
//     // } catch (error) {
//     //   res.status(500).json({ message: "Error fetching Home", error });
//     // }
//   }

//   async getProductBySlug(req, res) {
//     console.log(req.params.id);
//     try {
//       // TODO: Ko populate dc
//       const product = await Product.findOne({ _id: req.params.id }).populate(
//         "Category"
//       );
//       if (!product) {
//         return res.status(404).json({ message: "Product not found" });
//       }
//       res.json(product);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Error fetching product", error });
//     }
//   }

//   async getSpecialProducts(req, res) {
//     try {
//       const specialProducts = await Product.find({
//         category: { $in: ["motorcycle shocks ", "motorcycle shockss "] },
//       }).limit(3);
//       res.json(specialProducts);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "Error fetching special products", error });
//     }
//   }

//   async getFeaturedProducts(req, res) {
//     try {
//       const featuredProducts = await Product.find({}).limit(8);
//       res.json(featuredProducts);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "Error fetching featured products", error });
//     }
//   }

//   async getBannerProducts(req, res) {
//     try {
//       const bannerProducts = await Product.find({}).limit(2); // Có thể điều chỉnh query cho phù hợp
//       res.json(bannerProducts);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "Error fetching banner products", error });
//     }
//   }

//   async getLimit(req, res) {
//     const limit = req.query.limit;
//     try {
//       const bannerProducts = await Product.find({}).limit(limit); // Có thể điều chỉnh query cho phù hợp
//       res.json(bannerProducts);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "Error fetching banner products", error });
//     }
//   }

//   async getTrendingProducts(req, res) {
//     try {
//       const trendingProducts = await Product.find({}).limit(6);
//       res.json(trendingProducts);
//     } catch (error) {
//       res
//         .status(500)
//         .json({ message: "Error fetching trending products", error });
//     }
//   }

//   async addProduct(req, res, next) {
//     const newProduct = new Product(req.body);
//     newProduct.save().then(() => res.json(newProduct));
//   }
// }

// module.exports = new ProductsController();

// controller/productController.js

const Product = require("../models/product");

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Lấy danh sách sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId")
      .populate("brandId")
      .populate("models.modelId");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết sản phẩm theo ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId")
      .populate("brandId")
      .populate("models.modelId");
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
