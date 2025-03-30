
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
      bio: userObject.bio,
      address: userObject.address,
      city: userObject.city,
      state: userObject.state,
      zipCode: userObject.zipCode,
      country: userObject.country,
      company: userObject.company,
      website: userObject.website,
      socialLinks: userObject.socialLinks,
      preferences: userObject.preferences
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
        bio: user.bio,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        company: user.company,
        website: user.website,
        socialLinks: user.socialLinks,
        preferences: user.preferences
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

// @desc    Update user profile
// @route   PUT /auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name', 'phone', 'bio', 'address', 'city', 'state', 
      'zipCode', 'country', 'company', 'website', 'socialLinks', 'avatar'
    ];
    
    // Filter out fields that are not allowed to be updated
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = req.body[key];
      }
    });
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        bio: user.bio,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        company: user.company,
        website: user.website,
        socialLinks: user.socialLinks,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Update user password
// @route   PUT /auth/password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password"
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if current password matches
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Update notification preferences
// @route   PUT /auth/notification-preferences
// @access  Private
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, listings, messages } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update preferences
    user.preferences = {
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.preferences?.emailNotifications,
      listings: listings !== undefined ? listings : user.preferences?.listings,
      messages: messages !== undefined ? messages : user.preferences?.messages
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      preferences: user.preferences
    });
  } catch (error) {
    console.error("Update notification preferences error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
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

// @desc    Toggle favorite property
// @route   POST /auth/favorites/:propertyId
// @access  Private
exports.toggleFavoriteProperty = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Initialize favorites array if it doesn't exist
    if (!user.favorites) {
      user.favorites = [];
    }

    // Check if property is already favorited
    const favoriteIndex = user.favorites.indexOf(propertyId);
    
    if (favoriteIndex === -1) {
      // Add to favorites
      user.favorites.push(propertyId);
    } else {
      // Remove from favorites
      user.favorites.splice(favoriteIndex, 1);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: favoriteIndex === -1 ? 'Property added to favorites' : 'Property removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get favorite properties
// @route   GET /auth/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      count: user.favorites ? user.favorites.length : 0,
      favorites: user.favorites || []
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Toggle share profile
// @route   PUT /auth/share-profile
// @access  Private
exports.toggleShareProfile = async (req, res) => {
  try {
    const { isPublic } = req.body;
    
    if (isPublic === undefined) {
      return res.status(400).json({
        success: false,
        message: "isPublic field is required"
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 'preferences.isProfilePublic': isPublic },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: isPublic ? "Profile is now public" : "Profile is now private",
      isProfilePublic: user.preferences?.isProfilePublic
    });
  } catch (error) {
    console.error("Toggle share profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
