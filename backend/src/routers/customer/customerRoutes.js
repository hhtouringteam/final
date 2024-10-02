const express = require("express");
const router = express.Router();
const customerController = require("../../controllers/customer/customerController");

// Định nghĩa các route và bind `this` cho các phương thức của controller
router.get(
  "/products",
  customerController.getAllProducts.bind(customerController)
);
router.get(
  "/products/special",
  customerController.getSpecialProducts.bind(customerController)
);
router.get(
  "/products/featured",
  customerController.getFeaturedProducts.bind(customerController)
);
router.get(
  "/products/banner",
  customerController.getBannerProducts.bind(customerController)
);
router.get(
  "/products/trending",
  customerController.getTrendingProducts.bind(customerController)
);
router.get(
  "/products/:id",
  customerController.getProductById.bind(customerController)
);
router.get(
  "/products/filter",
  customerController.getProductsByFilter.bind(customerController)
);

module.exports = router;
