
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const {
  getUsersWithProperties,
  getPropertiesWithOwners,
  getSystemStats,
  getFormSubmissions,
  updateUserRole,
  sendNotificationToUsers,
  getRecentFormSubmissions,
  getAdminProfile,
  createProperty,
  deleteProperty
} = require("../controllers/adminController");

// All routes require authentication and admin role
router.use(protect);
router.use(authorize("admin"));

// Admin profile routes
router.get("/profile", getAdminProfile);

// Admin users routes
router.get("/users-with-properties", getUsersWithProperties);
router.put("/users/:userId/role", updateUserRole);

// Admin properties routes
router.get("/properties-with-owners", getPropertiesWithOwners);
router.post("/properties", createProperty);
router.delete("/properties/:propertyId", deleteProperty);

// Admin system routes
router.get("/system-stats", getSystemStats);

// Admin form submissions
router.get("/form-submissions", getFormSubmissions);
router.get("/recent-form-submissions", getRecentFormSubmissions);

// Admin notifications
router.post("/send-notification", sendNotificationToUsers);

module.exports = router;
