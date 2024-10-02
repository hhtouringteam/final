const express = require("express");
const router = express.Router();

const orderController = require("../../controllers/order/orderController");

// Tạo đơn hàng mới
router.post("/create", orderController.create);

router.post("/momo", orderController.momoPayment);
router.post("/momo/ipn", orderController.MomoIPN);

router.get("/summary", orderController.summary);
router.get("/lowstock", orderController.lowstock);
router.get("/topselling", orderController.topselling);

router.get("/:userId", orderController.getOrder);
router.put("/:orderId/status", orderController.updateOrderStatus);
module.exports = router;
