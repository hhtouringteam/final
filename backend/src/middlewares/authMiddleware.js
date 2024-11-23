const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware xác thực và kiểm tra vai trò
const authMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No token provided, access denied" });
    }
    const token = authHeader.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        console.log("User not found with userId:", decoded.userId);
        return res.status(404).json({ message: "User does not exist" });
      }
      req.user = {
        userId: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      };
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "You do not have permission to access" });
      }
      next();
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
