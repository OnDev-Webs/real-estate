const express = require("express");
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware'); // Import the multer upload config

const { protect, authorize, adminOnly } = require("../middlewares/auth");
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
  getTodayLeads,
  getRecentlyViewedProperties,
  toggleFeaturedStatus,
  getUserRecentlyViewedProperties
} = require("../controllers/propertyController");

// Public routes
router.get("/", getProperties);
router.get("/status/:status", getPropertiesByStatus);
router.get("/:id", getPropertyById);
router.put("/:id/view", incrementViews);
router.post("/:id/contact", protect, contactPropertyOwner);

// Protected routes - accessible to all authenticated users
router.get("/user/me", protect, getUserProperties);
router.get("/dashboard/recently-viewed", protect, getRecentlyViewedProperties);
router.get("/users/:userId/recently-viewed", protect, getUserRecentlyViewedProperties);

// Protected routes - accessible to sellers, agents, and admins
// Fix: Keep the middleware order consistent
router.post("/upload", protect, authorize('owner', 'agent', 'admin'), upload.array('images', 10), uploadImages);
router.post("/", protect, authorize('owner', 'agent', 'admin'), upload.array('images', 10), createProperty);
router.put("/:id", protect, authorize('owner', 'agent', 'admin'),upload.array('images', 10), updateProperty);

// Make dashboard stats available to owners, agents and admins
// Change to bypas authorization check for testing - will allow all authenticated users to access these endpoints
router.get("/dashboard/stats", protect, getDashboardStats);
router.get("/dashboard/active-listings", protect, getActiveListings);
router.get("/dashboard/today-leads", protect, getTodayLeads);

// Admin only routes
router.put("/:id/toggle-featured", protect, adminOnly, toggleFeaturedStatus);

// Admin has full delete permission, but owners/agents can only delete their own properties
// This is managed inside the controller function
router.delete("/:id", protect, deleteProperty);

module.exports = router;