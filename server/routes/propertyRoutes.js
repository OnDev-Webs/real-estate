
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
  getDashboardStats
} = require("../controllers/propertyController");

// Public routes
router.get("/", getProperties);
router.get("/status/:status", getPropertiesByStatus);
router.get("/:id", getPropertyById);
router.put("/:id/view", incrementViews);

// Protected routes
router.post("/", protect, createProperty);
router.post("/upload", protect, uploadImages);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/user/me", protect, getUserProperties);
router.get("/dashboard/stats", protect, getDashboardStats);

module.exports = router;
