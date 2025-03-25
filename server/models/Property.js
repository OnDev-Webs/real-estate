
const mongoose = require("mongoose");

// Create Schema
const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Please add an address"],
      },
      city: {
        type: String,
        required: [true, "Please add a city"],
      },
      state: {
        type: String,
        required: [true, "Please add a state"],
      },
      zip: {
        type: String,
        required: [true, "Please add a zip code"],
      },
      country: {
        type: String,
        default: "United States",
      },
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    features: {
      bedrooms: {
        type: Number,
        required: [true, "Please specify the number of bedrooms"],
      },
      bathrooms: {
        type: Number,
        required: [true, "Please specify the number of bathrooms"],
      },
      area: {
        type: Number,
        required: [true, "Please specify the area in square feet"],
      },
      yearBuilt: {
        type: Number,
        default: function() {
          return new Date().getFullYear();
        },
      },
      propertyType: {
        type: String,
        enum: ["apartment", "house", "villa", "land", "commercial"],
        required: [true, "Please specify the property type"],
      },
      status: {
        type: String,
        enum: ["for-sale", "for-rent", "sold", "pending"],
        required: [true, "Please specify the property status"],
      },
      floorPlan: {
        type: String,
      },
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    agent: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        default: "Not provided",
      },
      image: {
        type: String,
        default: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Add text index for search
PropertySchema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.address": "text",
});

module.exports = mongoose.model("Property", PropertySchema);
