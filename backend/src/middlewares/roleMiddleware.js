// middlewares/roleMiddleware.js

const jwt = require("jsonwebtoken");

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Kiểm tra xem người dùng đã được xác thực và có vai trò không
      if (!req.user) {
        return res.status(401).json({ message: "Chưa xác thực" });
      }

      // Kiểm tra vai trò của người dùng
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập" });
      }

      // Tiếp tục với middleware tiếp theo nếu vai trò hợp lệ
      next();
    } catch (error) {
      res.status(500).json({ message: "Lỗi xác thực vai trò", error });
    }
  };
};

module.exports = roleMiddleware;
