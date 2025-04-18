
const mongoose = require("mongoose");

const PropertyViewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate views
PropertyViewSchema.index({ user: 1, property: 1 });

module.exports = mongoose.model("PropertyView", PropertyViewSchema);
