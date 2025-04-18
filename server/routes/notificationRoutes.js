const express = require("express");
const router = express.Router();
const { protect} = require("../middlewares/auth");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createPropertyInquiryNotification
} = require("../controllers/notificationController");

// Protected routes
router.use(protect);

router.get("/", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/read-all", markAllAsRead);
router.delete("/:id", deleteNotification);

// Admin only route
router.post("/", protect, createNotification);  // Admin Protect Middleware

// Property Inquiry Notification Route
router.post("/inquiry", createPropertyInquiryNotification);

module.exports = router;
