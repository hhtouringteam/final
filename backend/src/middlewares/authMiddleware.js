const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware xác thực và kiểm tra vai trò
const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Không có token, truy cập bị từ chối" });
    }

    const token = authHeader.split(" ")[1]; // Tách token từ header "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    try {
      // Xác thực token JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log("Không tìm thấy người dùng với userId:", decoded.userId);
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }

      // Lưu thông tin người dùng vào req.user
      req.user = {
        userId: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      };

      // Kiểm tra vai trò nếu cần
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      return res.status(401).json({ message: "Token không hợp lệ" });
    }
  };
};

module.exports = authMiddleware;
