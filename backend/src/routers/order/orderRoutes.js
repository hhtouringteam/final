const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const orderController = require("../../controllers/order/orderController");
const authMiddleware = require("../../middlewares/authMiddleware");
// Tạo đơn hàng mới
router.post("/create", orderController.create);

router.post("/cod", orderController.createOrderCOD);

router.get(
  "/admin/allOrders",
  authMiddleware("admin"),
  orderController.getAllOrders
);
router.get("/admin/:id", authMiddleware("admin"), orderController.getOrderById);

router.get("/summary", orderController.summary);
router.get("/lowstock", orderController.lowstock);
router.get("/topselling", orderController.topselling);
router.get("/:userId", orderController.getOrder);
router.put("/:orderId/status", orderController.updateOrderStatus);
module.exports = router;
