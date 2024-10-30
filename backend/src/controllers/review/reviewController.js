const Review = require("../../models/reviewModel");
const Product = require("../../models/productModel");

class ReviewController {
  // Lấy danh sách đánh giá cho một sản phẩm
  async getReviews(req, res) {
    const { productId } = req.params;

    try {
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Error fetching reviews" });
    }
  }

  // Thêm đánh giá mới
  async addReview(req, res) {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId; // Lấy từ middleware xác thực
    const username = req.user.username; // Lấy từ middleware xác thực
    console.log("productId", productId);
    console.log("userId", userId);
    console.log("username", username);

    try {
      // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
      const alreadyReviewed = await Review.findOne({ productId, userId });
      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
      }

      // Tạo đánh giá mới
      const review = new Review({
        productId,
        userId,
        username,
        rating: Number(rating),
        comment,
      });
      console.log("review", review);
      await review.save();

      // Cập nhật số lượng đánh giá và điểm trung bình cho sản phẩm
      const reviews = await Review.find({ productId });

      const numReviews = reviews.length;
      const averageRating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

      await Product.findByIdAndUpdate(productId, { numReviews, averageRating });

      res.status(201).json({ success: true, data: review });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "Error adding review" });
    }
  }
}

module.exports = new ReviewController();
