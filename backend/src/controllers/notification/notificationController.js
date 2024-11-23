const mongoose = require("mongoose");
const Notification = require("../../models/notificationModel");
class NotificationController {
  async getNotifications(req, res) {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      console.log("notifications---------------",notifications)
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Error fetching notifications." });
    }
  }

  // Phương thức lấy số lượng thông báo chưa đọc
  async getUnreadNotificationCount(req, res) {
    try {
      const count = await Notification.countDocuments({ isRead: false });
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
      res
        .status(500)
        .json({ message: "Error fetching unread notification count." });
    }
  }

  // Phương thức đánh dấu tất cả thông báo là đã đọc
  async markAllAsRead(req, res) {
    try {
      await Notification.updateMany({ isRead: false }, { isRead: true });
      res
        .status(200)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Error marking notifications as read." });
    }
  }
}
module.exports = new NotificationController();
