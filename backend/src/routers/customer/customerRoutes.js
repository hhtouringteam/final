const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customer/customerController");

// Lấy danh sách tất cả sản phẩm
router.get("/", customerController.getAllProducts.bind(customerController));

// Lấy chi tiết một sản phẩm theo ID
router.get("/:id", customerController.getProductById.bind(customerController));

// Lọc sản phẩm theo danh mục hoặc thương hiệu
router.get(
  "/filter",
  customerController.getProductsByFilter.bind(customerController)
);

// Tìm kiếm sản phẩm theo tên
router.get(
  "/search",
  customerController.searchProductsByName.bind(customerController)
);

module.exports = router;
