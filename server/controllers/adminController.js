const User = require("../models/User");
const Property = require("../models/Property");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// Get all users with their property counts
exports.getUsersWithProperties = async (req, res) => {
  try {
    // Aggregate users with property counts
    const users = await User.aggregate([
      {
        $lookup: {
          from: "properties",
          localField: "_id",
          foreignField: "owner",
          as: "properties"
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          avatar: 1,
          phone: 1,
          company: 1,
          createdAt: 1,
          propertyCount: { $size: "$properties" },
          properties: {
            $map: {
              input: "$properties",
              as: "property",
              in: {
                _id: "$$property._id",
                title: "$$property.title",
                status: "$$property.features.status"
              }
            }
          }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      users
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

// Get all properties with their owners/agents
exports.getPropertiesWithOwners = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate({
        path: "owner",
        select: "name email role phone company"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties
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

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const propertiesByStatus = await Property.aggregate([
      {
        $group: {
          _id: "$features.status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const propertiesByType = await Property.aggregate([
      {
        $group: {
          _id: "$features.propertyType",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Calculate monthly property additions for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyProperties = await Property.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);
    
    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        usersByRole,
        propertiesByStatus,
        propertiesByType,
        monthlyProperties
      }
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

// Get all form submissions (property inquiries, contact forms, etc.)
exports.getFormSubmissions = async (req, res) => {
  try {
    // This would typically query a "FormSubmission" model, but we'll use Notifications as a proxy
    const limit = parseInt(req.query.limit) || 50;
    
    const submissions = await Notification.find({
      type: { $in: ['property-inquiry', 'contact-form', 'property-visit'] }
    })
    .populate({
      path: 'user',
      select: 'name email role'
    })
    .populate({
      path: 'property',
      select: 'title features.status'
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
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

// Get recent form submissions
exports.getRecentFormSubmissions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const submissions = await Notification.find({
      type: { $in: ['property-inquiry', 'contact-form', 'property-visit'] }
    })
    .populate({
      path: 'user',
      select: 'name email role'
    })
    .populate({
      path: 'property',
      select: 'title features.status'
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
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

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ["buyer", "owner", "agent", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified"
      });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      user
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

// Send notification to users
exports.sendNotificationToUsers = async (req, res) => {
  try {
    const { userIds, message, title } = req.body;
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "User IDs are required"
      });
    }
    
    if (!message || !title) {
      return res.status(400).json({
        success: false,
        message: "Message and title are required"
      });
    }
    
    // Create notifications for each user
    const notifications = await Promise.all(
      userIds.map(async (userId) => {
        const notification = new Notification({
          user: userId,
          title,
          message,
          type: 'admin-notification'
        });
        
        await notification.save();
        return notification;
      })
    );
    
    return res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
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

// Get active user with role "admin"
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.user.id, role: 'admin' }).select("-password");
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      admin
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

// Create a new property as admin
exports.createProperty = async (req, res) => {
  try {
    const propertyData = req.body;
    
    // Set the admin as the owner
    propertyData.user = req.user.id;
    propertyData.owner = req.user.id;
    
    // If agent field is not provided, use admin as agent
    if (!propertyData.agent) {
      propertyData.agent = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "Not provided",
        image: req.user.avatar || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      };
    }
    
    const property = new Property(propertyData);
    await property.save();
    
    return res.status(201).json({
      success: true,
      property
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

// Delete property as admin
exports.deleteProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    
    const property = await Property.findByIdAndDelete(propertyId);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Property deleted successfully"
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
