
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to create JWT token
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// Helper function to send user data with token
const sendTokenResponse = (user, res) => {
  // Create token
  const token = createToken(user);

  // Convert mongoose document to plain object
  const userObject = user.toObject();
  
  // Remove sensitive information
  delete userObject.password;

  res.status(200).json({
    success: true,
    token,
    user: {
      id: userObject._id,
      name: userObject.name,
      email: userObject.email,
      role: userObject.role,
      avatar: userObject.avatar,
      phone: userObject.phone,
      description: userObject.description,
    },
  });
};

// @desc    Register user
// @route   POST /auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "buyer",
    });

    sendTokenResponse(user, res);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendTokenResponse(user, res);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        description: user.description,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Handle OAuth success for Google and Facebook
// @route   GET /auth/oauth/success
// @access  Private
exports.oauthSuccess = (req, res) => {
  // Passport attaches user to request
  if (!req.user) {
    return res.status(401).redirect("/login?error=authentication_failed");
  }
  
  const token = createToken(req.user);
  
  // Use absolute URL to ensure token is properly passed
  // Frontend will handle reading the token from URL and authenticating
  const frontendBaseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:8080';
  
  res.redirect(`${frontendBaseUrl}/?token=${token}`);
};
