const express = require("express");
const router = express.Router();
const installmentController = require("../../controllers/installment/installmentController");

router.get("/summary", installmentController.getInstallmentSummary);

// Route để lấy thống kê chi tiết Installments
router.get(
  "/detailed-summary",
  installmentController.getDetailedInstallmentSummary
);

// Route để lấy tất cả Installments
router.get("/", installmentController.getAllInstallments);

router.get("/:installmentId", installmentController.getInstallmentDetails);
module.exports = router;
