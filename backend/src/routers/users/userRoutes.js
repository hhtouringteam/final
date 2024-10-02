const express = require("express");
const router = express.Router();
const upload = require("../../utils/upload");
const userController = require("../../controllers/users/userController");

const authMiddleware = require("../../middlewares/authMiddleware");

// User routes
router.post("/auth/google", userController.google);
router.post("/auth/register", userController.register);
router.post("/auth/login", userController.login);
router.get("/", authMiddleware("admin"), userController.getUserInfo);
router.get("/users", userController.getNewUsers);
router.put(
  "/update/:id",
  authMiddleware("admin"),
  userController.updateUserInfo
);
router.delete(
  "/delete/:id",
  authMiddleware("admin"),
  userController.deleteUser
);
router.put("/change-password", authMiddleware, userController.changePassword);
router.post("/forgot-password", userController.forgotPassword);
router.post(
  "/avatar/:id",
  authMiddleware("user"),
  upload.single("avatar"),
  userController.uploadAvatar
);
router.post("/reset-password/:token", userController.resetPassword);
router.get(
  "/dashboard",
  authMiddleware("admin"),
  userController.adminDashboard
);

module.exports = router;
