// const express = require("express");
// const router = express.Router();
// const ProductsController = require("../controllers/ProductsController");
// router.get("/", ProductsController.get);
// router.get("/trending-products", ProductsController.getTrendingProducts);
// router.get("/banner-products", ProductsController.getBannerProducts);
// router.get("/featured-products", ProductsController.getFeaturedProducts);
// router.get("/special-products", ProductsController.getSpecialProducts);
// // req.body -> POST, PATCH. PUT
// router.post("/create", ProductsController.addProduct);
// router.get("/:id", ProductsController.getProductBySlug); // params

// // router.get("/", ProductsController.index);
// module.exports = router;

// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Tạo sản phẩm mới
router.post("/", productController.createProduct);

// Lấy danh sách sản phẩm
router.get("/", productController.getProducts);

// Lấy chi tiết sản phẩm theo ID
router.get("/:id", productController.getProductById);

// Cập nhật sản phẩm
router.put("/:id", productController.updateProduct);

// Xóa sản phẩm
router.delete("/:id", productController.deleteProduct);

module.exports = router;
