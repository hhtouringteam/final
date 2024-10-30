const express = require("express");
const router = express.Router();
const ReviewController = require("../../controllers/review/reviewController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Lấy danh sách đánh giá cho một sản phẩm
router.get("/:productId/reviews", ReviewController.getReviews);

// Thêm đánh giá mới (yêu cầu đăng nhập)
router.post(
  "/:productId/reviews",
  authMiddleware("user"),
  ReviewController.addReview
);

module.exports = router;
