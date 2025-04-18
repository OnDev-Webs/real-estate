
// const express = require("express");
// const router = express.Router();
// const { protect, adminOnly } = require("../middlewares/auth");
// const {
//   toggleFavorite,
//   getFavorites,
//   getUserProfile,
//   updateUserProfile,
//   toggleShareProfile
// } = require("../controllers/userController");

// // Protected routes - require authentication
// router.post("/favorites/:propertyId", protect, toggleFavorite);
// router.get("/favorites", protect, getFavorites);
// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);
// router.put("/preferences/share-profile", protect, toggleShareProfile);

// // Admin-only routes
// router.get("/all", protect, adminOnly, (req, res) => {
//   // This would be implemented in a controller
//   res.status(200).json({
//     success: true,
//     message: "This endpoint would return all users (admin only)"
//   });
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/auth");
const {
  toggleFavorite,
  getFavorites,
  getUserProfile,
  updateUserProfile,
  toggleShareProfile,
  getAllUsers // 👈 Import it here
} = require("../controllers/userController");

// Protected routes - require authentication
router.post("/favorites/:propertyId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/preferences/share-profile", protect, toggleShareProfile);

// Admin-only routes
router.get("/all", protect, adminOnly, getAllUsers); // 👈 Use controller here

module.exports = router;
