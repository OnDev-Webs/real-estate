
const mongoose = require("mongoose");

const FormSubmissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['property-inquiry', 'contact-form', 'property-visit', 'agent-contact', 'admin-notification'],
      default: 'contact-form'
    },
    recipients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    read: {
      type: Boolean,
      default: false,
    },
    readBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormSubmission", FormSubmissionSchema);
