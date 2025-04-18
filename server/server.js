
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const routes = require("./routes/index");
require("dotenv").config();

// Initialize express
const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// If using Express + cors
app.use(cors({
  origin: "http://localhost:8080", // frontend origin
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Initialize passport and session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Require passport config
require("./config/passport")(passport);

// Define routes
app.use("/", routes);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "build", "index.html"));
  });
}

// PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
