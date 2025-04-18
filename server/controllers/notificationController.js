const Notification = require("../models/Notification");
const User = require("../models/User");
const Property = require("../models/Property"); // Assuming you have a Property model

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 notifications per page
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("property", "title features.status");

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    if (result.nModified === 0) {
      return res.status(404).json({
        success: false,
        message: "No unread notifications found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await notification.remove();

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Create notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, userId, type, propertyId } = req.body;

    if (!title || !message || !userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, message, and userId",
      });
    }

    const notification = await Notification.create({
      title,
      message,
      user: userId,
      type: type || "system",
      property: propertyId || null,
    });

    res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Create notification for property inquiry
exports.createPropertyInquiryNotification = async (req, res) => {
  try {
    const { propertyId, message } = req.body;
    const userId = req.user.id;

    // Find property owner
    const property = await Property.findById(propertyId).populate("user");
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }
    
    // Create notification for property owner
    await Notification.create({
      title: "New Property Inquiry",
      message: `${req.user.name} is interested in your property: ${property.title}`,
      user: property.user._id,
      type: "property-inquiry",
      property: propertyId,
    });
    
    // Create notification for admin users
    const admins = await User.find({ role: "admin" });
    
    for (const admin of admins) {
      await Notification.create({
        title: "New Property Inquiry",
        message: `${req.user.name} is interested in property: ${property.title}`,
        user: admin._id,
        type: "property-inquiry",
        property: propertyId,
      });
    }
    
    res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
