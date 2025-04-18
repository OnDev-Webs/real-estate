const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, default: "system" },
    read: { type: Boolean, default: false },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" }, // Reference to the Property model
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
