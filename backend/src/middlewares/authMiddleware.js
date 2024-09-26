const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Đảm bảo bạn đã import model User

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Kiểm tra xem có header Authorization không
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  // Lấy token từ header Authorization
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key"); // Sử dụng JWT_SECRET từ biến môi trường hoặc key tạm thời

    // Tìm người dùng dựa trên thông tin trong token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Lưu thông tin người dùng vào req để sử dụng cho các middleware sau
    req.user = {
      userId: user._id,
      role: user.role, // Lưu cả vai trò của người dùng
    };

    // Tiếp tục với middleware tiếp theo
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
