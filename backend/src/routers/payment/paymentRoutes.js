// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../../controllers/payment/paymentController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.post("/createPayOS", paymentController.createPayOSPayment);
router.post("/payos/webhook", paymentController.handlePayOSWebhook);

router.post("/createZaloPay", paymentController.createZaloPayPayment);
router.post("/zalopay/webhook", paymentController.handleZaloPayWebhook);


router.post("/updatePaymentStatus", paymentController.updatePaymentStatus);
router.post(
  "/updateInstallmentPaymentStatus",
  paymentController.updateInstallmentPaymentStatus
);
router.post("/payInstallment", paymentController.payInstallment);
module.exports = router;
