
const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Toggle property favorite status for a user
// @route   POST /users/favorites/:propertyId
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    // First check if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if the property is already in favorites
    const isFavorite = user.favorites.includes(propertyId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      isFavorite: !isFavorite,
      message: isFavorite 
        ? "Property removed from favorites" 
        : "Property added to favorites"
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

// @desc    Get user's favorite properties
// @route   GET /users/favorites
// @access  Private
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and populate the favorites
    const user = await User.findById(userId).populate('favorites');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites,
      favoriteIds: user.favorites.map(fav => fav._id || fav.id)
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

// @desc    Get user profile
// @route   GET /users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user by ID, excluding the password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, bio, address, city, state, zipCode, country, company, website, socialLinks, preferences } = req.body;
    
    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        name,
        phone, 
        bio, 
        address, 
        city, 
        state, 
        zipCode, 
        country, 
        company, 
        website,
        socialLinks,
        preferences
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Toggle profile sharing preference
// @route   PUT /users/preferences/share-profile
// @access  Private
exports.toggleShareProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shareProfile } = req.body;
    
    if (typeof shareProfile !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "shareProfile must be a boolean value"
      });
    }
    
    // Update user's share profile preference
    const user = await User.findByIdAndUpdate(
      userId,
      { 'preferences.shareProfile': shareProfile },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: `Profile sharing ${shareProfile ? 'enabled' : 'disabled'}`
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


// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password field

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
