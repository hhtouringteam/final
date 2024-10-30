const express = require("express");
const router = express.Router();
const EmailogControllerr = require("../../controllers/email/emailogController");
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/", authMiddleware("admin"), EmailogControllerr.getEmailLogs);
router.get(
  "/unread-count",
  authMiddleware("admin"),
  EmailogControllerr.getUnreadEmailLogCount
);
router.post(
  "/mark-all-as-read",
  authMiddleware("admin"),
  EmailogControllerr.markAllEmailLogsAsRead
);
module.exports = router;
