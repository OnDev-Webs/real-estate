const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

// Initialize Passport
app.use(passport.initialize());
require("./config/passport");

// Import routes
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");

// Mount routes
app.use("/auth", authRoutes);
app.use("/properties", propertyRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
