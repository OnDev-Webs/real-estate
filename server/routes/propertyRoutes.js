
const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middlewares/auth");
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  getPropertiesByStatus,
  uploadImages,
  incrementViews,
  getDashboardStats,
  contactPropertyOwner,
  getActiveListings,
  getTodayLeads
} = require("../controllers/propertyController");

// Public routes
router.get("/", getProperties);
router.get("/status/:status", getPropertiesByStatus);
router.get("/:id", getPropertyById);
router.put("/:id/view", incrementViews);
router.post("/:id/contact", protect, contactPropertyOwner);

// Protected routes
router.post("/", protect, createProperty);
router.post("/upload", protect, uploadImages); // Make sure this route is properly defined
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/user/me", protect, getUserProperties);
router.get("/dashboard/stats", protect, getDashboardStats);
router.get("/dashboard/active-listings", protect, getActiveListings);
router.get("/dashboard/today-leads", protect, getTodayLeads);

module.exports = router;
