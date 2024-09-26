const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars"); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// User routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.delete("/delete", authMiddleware, userController.deleteUser);
router.get("/", authMiddleware, userController.getUserInfo);
router.put("/", authMiddleware, userController.updateUserInfo);
router.put("/change-password", authMiddleware, userController.changePassword);
router.post("/forgot-password", userController.forgotPassword);
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.uploadAvatar
);

// Đặt lại mật khẩu
router.post("/reset-password/:token", userController.resetPassword);
// Admin xóa tài khoản người dùng

router.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUserByAdmin
);
module.exports = router;
