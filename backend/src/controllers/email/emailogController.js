const mongoose = require("mongoose");
const EmailLog = require("../../models/emailLogModel");
class EmailogController {
  async getEmailLogs(req, res) {
    try {
      const emailLogs = await EmailLog.find().sort({ sentAt: -1 }).populate({
        path: "relatedOrderId",
        select: "orderCode",
      });
      res.status(200).json({ success: true, data: emailLogs });
    } catch (error) {
      console.error("Error fetching email logs:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách email logs", error });
    }
  }
  async getUnreadEmailLogCount(req, res) {
    try {
      const count = await EmailLog.countDocuments({ isRead: false });
      res.status(200).json({ success: true, count });
    } catch (error) {
      console.error("Error fetching unread email logs count:", error);
      res
        .status(500)
        .json({ message: "Error fetching unread email logs count." });
    }
  }

  // Phương thức đánh dấu tất cả email logs là đã xem
  async markAllEmailLogsAsRead(req, res) {
    try {
      await EmailLog.updateMany({ isRead: false }, { isRead: true });
      res
        .status(200)
        .json({ success: true, message: "All email logs marked as read" });
    } catch (error) {
      console.error("Error marking email logs as read:", error);
      res.status(500).json({ message: "Error marking email logs as read." });
    }
  }
}

module.exports = new EmailogController();
