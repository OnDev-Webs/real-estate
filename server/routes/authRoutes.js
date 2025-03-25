
const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  register,
  login,
  getMe,
  oauthSuccess
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

// Register & Login routes
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login?error=google_auth_failed",
    session: false,
  }),
  oauthSuccess
);

// Facebook OAuth routes
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login?error=facebook_auth_failed",
    session: false,
  }),
  oauthSuccess
);

module.exports = router;
