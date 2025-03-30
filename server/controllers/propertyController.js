
const Property = require("../models/Property");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'property-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});

// Create multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).array('images', 10); // Allow up to 10 images

// @desc    Upload property images to Cloudinary
// @route   POST /properties/upload
// @access  Private (Only authenticated users)
exports.uploadImages = async (req, res) => {
  try {
    // Use the upload middleware as a promise
    const uploadPromise = new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    await uploadPromise;

    // Extract URLs from the uploaded files
    const urls = req.files.map(file => file.path);

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      urls: urls
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get all properties
// @route   GET /properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    let query = {};
    
    // Apply status filter if provided
    if (req.query.status) {
      query["features.status"] = req.query.status;
    }
    
    const properties = await Property.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get property by ID
// @route   GET /properties/:id
// @access  Public
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get property error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create a new property
// @route   POST /properties
// @access  Private (Only agents and owners)
exports.createProperty = async (req, res) => {
  try {
    // Check if user is agent or owner
    if (req.user.role !== "agent" && req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only agents and property owners can create property listings",
      });
    }
    
    // Add user ID to property
    const propertyData = {
      ...req.body,
      user: req.user.id,
      agent: {
        id: req.user.id,
        name: req.user.name,
        phone: req.user.phone || "Not provided",
        email: req.user.email,
        image: req.user.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      },
      views: 0 // Initialize views counter
    };
    
    const property = await Property.create(propertyData);
    
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Update property
// @route   PUT /properties/:id
// @access  Private (Only property owner, agent, or admin)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    // Check ownership or admin role
    if (
      property.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      property.agent.id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property",
      });
    }
    
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Update property error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Delete property
// @route   DELETE /properties/:id
// @access  Private (Only property owner, agent, or admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    // Check ownership or admin role
    if (
      property.user.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      property.agent.id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this property",
      });
    }
    
    // Delete associated images from Cloudinary
    if (property.images && property.images.length > 0) {
      try {
        for (const imageUrl of property.images) {
          // Extract the public_id from Cloudinary URL
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`property-images/${publicId}`);
        }
      } catch (error) {
        console.error("Error deleting images:", error);
        // Continue with property deletion even if image deletion fails
      }
    }
    
    await property.deleteOne();
    
    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get properties by user
// @route   GET /properties/user/me
// @access  Private
exports.getUserProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get user properties error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get properties by status
// @route   GET /properties/status/:status
// @access  Public
exports.getPropertiesByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    
    // Validate status
    const validStatuses = ["for-sale", "for-rent", "sold", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status parameter",
      });
    }
    
    const properties = await Property.find({
      "features.status": status
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get properties by status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Increment property view count
// @route   PUT /properties/:id/view
// @access  Public
exports.incrementViews = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    res.status(200).json({
      success: true,
      views: property.views,
    });
  } catch (error) {
    console.error("Increment views error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /properties/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Get user's properties
    const properties = await Property.find({ user: userId });
    
    // Calculate statistics
    const totalProperties = properties.length;
    const activeProperties = properties.filter(
      p => p.features.status === "for-sale" || p.features.status === "for-rent"
    ).length;
    
    // Calculate total views
    const totalViews = properties.reduce((sum, property) => sum + (property.views || 0), 0);
    
    // Get recent properties (last 5)
    const recentProperties = await Property.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        totalProperties,
        activeProperties,
        totalViews,
        recentProperties
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Contact property owner
// @route   POST /properties/:id/contact
// @access  Private
exports.contactPropertyOwner = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    // Get message from request body
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }
    
    // Create a notification for the property owner
    const Notification = require("../models/Notification");
    await Notification.create({
      recipient: property.user,
      sender: req.user.id,
      property: property._id,
      type: "contact",
      title: "New Property Inquiry",
      message: `${req.user.name} is interested in your property: ${property.title}`,
      read: false
    });
    
    // TODO: Send email to property owner (in a production application)
    
    res.status(200).json({
      success: true,
      message: "Your message has been sent to the property owner"
    });
  } catch (error) {
    console.error("Contact property owner error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get active listings
// @route   GET /properties/dashboard/active-listings
// @access  Private
exports.getActiveListings = async (req, res) => {
  try {
    const properties = await Property.find({
      user: req.user.id,
      "features.status": { $in: ["for-sale", "for-rent"] }
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Get active listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get today's leads (views in last 24 hours)
// @route   GET /properties/dashboard/today-leads
// @access  Private
exports.getTodayLeads = async (req, res) => {
  try {
    // Create a date object for 24 hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);
    
    // Get all notifications for views on user's properties in the last 24 hours
    const Notification = require("../models/Notification");
    const notifications = await Notification.find({
      recipient: req.user.id,
      type: { $in: ["view", "contact"] },
      createdAt: { $gte: oneDayAgo }
    }).populate("sender", "name email phone").populate("property");
    
    // Format data for frontend
    const leads = notifications.map(notification => ({
      id: notification._id,
      name: notification.sender ? notification.sender.name : "Anonymous",
      email: notification.sender ? notification.sender.email : "Not provided",
      phone: notification.sender ? notification.sender.phone : "Not provided",
      property: notification.property,
      message: notification.message,
      type: notification.type,
      date: notification.createdAt,
      status: "new"
    }));
    
    res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    console.error("Get today leads error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
