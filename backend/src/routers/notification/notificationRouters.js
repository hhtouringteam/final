const express = require("express");
const router = express.Router();
const notificatiotroller = require("../../controllers/notification/notificationController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware("admin"), notificatiotroller.getNotifications);
router.get(
  "/unread-count",
  authMiddleware("admin"),
  notificatiotroller.getUnreadNotificationCount
);
router.post(
  "/mark-all-as-read",
  authMiddleware("admin"),
  notificatiotroller.markAllAsRead
);
module.exports = router;
