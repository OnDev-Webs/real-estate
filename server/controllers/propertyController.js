const Property = require("../models/Property");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: "ddprm5mb0",
//   api_key: "928433399422473",
//   api_secret: "uvZNF4CwDCw62qO9tw9jc0DeYaU"
// });

// // Configure storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'property-images',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
//   }
// });

// // Create multer upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
// }).array('images', 10); // Allow up to 10 images





// @desc    Upload property images to Cloudinary (independent endpoint)
// @route   POST /properties/upload
// @access  Private
// Upload images and return Cloudinary URLs
exports.uploadImages = async (req, res) => {
  try {
    const urls = req.files.map(file => file.path); // Assuming the path is Cloudinary URL
    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      urls,  // Return the uploaded image URLs
    });
    console.log("Uploaded image URLs:", urls);
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Create a new property
exports.createProperty = async (req, res) => {
  try {
    // Only allow agents, owners, or admins to create properties
    if (!["agent", "owner", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only agents, owners, or admins can create property listings",
      });
    }

    let propertyData;
    // Check if there's data in the 'data' field of the request body
    if (req.body.data) {
      try {
        propertyData = JSON.parse(req.body.data); // Parse the 'data' field as JSON
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid JSON format in form-data 'data' field",
        });
      }
    } else {
      propertyData = req.body; // Use the body directly if no 'data' field
    }

    // Add user and agent details to propertyData
    propertyData.user = req.user.id;
    propertyData.agent = {
      id: req.user.id,
      name: req.user.name,
      phone: req.user.phone || "Not provided",
      email: req.user.email,
      image: req.user.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    };
    propertyData.views = 0;

    // Check if images were uploaded, if so, add to propertyData
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(file => file.path); // Assuming the path is a valid image URL
    } else {
      propertyData.images = []; // If no images uploaded, assign an empty array
    }

    // Create the property in the database
    const property = await Property.create(propertyData);

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property,
    });
    console.log("Property created:", property);
  } catch (error) {
    console.error("Create property error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};







// @desc    Get all properties
// @route   GET /properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    let query = {};
    
    if (req.query.status) {
      query["features.status"] = req.query.status;
    }
    
    const properties = await Property.find(query).sort({ createdAt: -1 });

    // Logging property images for verification
    properties.forEach(property => {
      console.log("Property images: ", property.images);
    });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
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
      property,  // Property contains images here
    });
  } catch (error) {
    console.error("Error fetching property:", error);
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

    // Handle image upload if available
    let imageUrls = [];
    if (req.files) {
      // Assuming Cloudinary returns an array of files
      imageUrls = req.files.map((file) => file.path);  // Store image URLs from Cloudinary
    }

    // Prepare updated property data (using the request body and any new images)
    const updatedPropertyData = {
      ...req.body,  // Property fields from the form
      images: imageUrls,  // Attach Cloudinary image URLs to the property data
    };

    // Update property in the database
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updatedPropertyData,
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
      error: error.message
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

// @desc    Toggle featured status
// @route   PUT /properties/:id/toggle-featured
// @access  Private (Only property owner or admin)
exports.toggleFeaturedStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    // Check if user is admin or property owner/agent
    if (
      property.user.toString() !== req.user.id && 
      req.user.role !== "admin" &&
      property.agent.id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this property"
      });
    }
    
    // Toggle the featured status
    property.featured = !property.featured;
    await property.save();
    
    res.status(200).json({
      success: true,
      message: `Property ${property.featured ? 'marked as featured' : 'removed from featured'}`,
      property
    });
  } catch (error) {
    console.error("Toggle featured status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Contact property owner/agent
// @route   POST /properties/:id/contact
// @access  Private
exports.contactPropertyOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message"
      });
    }
    
    // Get the property with owner details
    const property = await Property.findById(id).populate('owner', 'name email');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    // Create a notification for the property owner
    const ownerNotification = new Notification({
      title: `Inquiry about your property: ${property.title}`,
      message: message,
      user: property.owner._id,
      sender: req.user._id,
      property: property._id,
      type: 'property-inquiry',
    });
    
    await ownerNotification.save();
    
    // Find super admin users
    const superAdmins = await User.find({ role: 'admin' }).select('_id');
    
    // Create notifications for all super admins
    for (const admin of superAdmins) {
      const adminNotification = new Notification({
        title: `New property inquiry for: ${property.title}`,
        message: `${req.user.name} inquired about property "${property.title}" owned by ${property.owner.name}: ${message}`,
        user: admin._id,
        sender: req.user._id,
        property: property._id,
        type: 'property-inquiry',
      });
      
      await adminNotification.save();
    }
    
    // Create a form submission record
    const formSubmission = new FormSubmission({
      user: req.user._id,
      property: property._id,
      title: `Inquiry about: ${property.title}`,
      message: message,
      type: 'property-inquiry',
      recipients: [property.owner._id, ...superAdmins.map(admin => admin._id)],
    });
    
    await formSubmission.save();
    
    // Send email notification (would be implemented with a proper email service)
    
    return res.status(200).json({
      success: true,
      message: "Your message has been sent to the property owner"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
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
    // Define start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch properties owned by the current user
    const properties = await Property.find({ user: req.user.id });

    const leads = [];

    properties.forEach(property => {
      // Filter views that occurred today
      const viewsToday = property.viewHistory?.filter(view => {
        return (
          view.viewedAt >= startOfDay &&
          view.viewedAt <= endOfDay
        );
      });

      if (viewsToday && viewsToday.length > 0) {
        leads.push({
          property: {
            id: property._id,
            title: property.title,
            image: property.images?.[0] || null
          },
          views: viewsToday.length,
          viewers: viewsToday.map(v => v.user),
          timestamps: viewsToday.map(v => v.viewedAt)
        });
      }
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    console.error("Error fetching today's leads:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};





// @desc    Get recently viewed properties
// @route   GET /properties/dashboard/recently-viewed
// @access  Private
exports.getRecentlyViewedProperties = async (req, res) => {
  try {
    // Find properties recently viewed by the user
    const properties = await Property.find({
      recentlyViewedBy: req.user.id
    }).sort({ lastViewed: -1 }).limit(5);
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Get recently viewed properties error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get user's recently viewed properties
// @route   GET /properties/users/:userId/recently-viewed
// @access  Private
exports.getUserRecentlyViewedProperties = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Check if the requesting user is the owner or an admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this user's recently viewed properties"
      });
    }
    
    // Find properties where the user is in the viewHistory
    const properties = await Property.find({
      'viewHistory.user': userId
    })
      .sort({ 'viewHistory.viewedAt': -1 }) // Sort by the most recent view
      .limit(5); // Limit to 5 recently viewed properties
    
    res.status(200).json({
      success: true,
      count: properties.length,
      properties
    });
  } catch (error) {
    console.error("Get user recently viewed properties error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


