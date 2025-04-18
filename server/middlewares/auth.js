const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes by checking if the user is authenticated
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("Token from Authorization Header:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT Payload:", decoded);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Authenticated User:", req.user);

    // ✅ Check and log if user is an admin
    if (req.user.role === "admin") {
      console.log("✅ Admin access granted for:", req.user.email);
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again",
      });
    }

    console.error("JWT Verification Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route, token invalid",
    });
  }
};


// Grant access to specific roles (e.g., admin, user)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

// Special middleware for admin-only routes
exports.adminOnly = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Only admin users can access this resource",
    });
  }
  next();
};
