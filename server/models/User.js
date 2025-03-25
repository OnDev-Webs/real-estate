
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["buyer", "owner", "agent", "admin"],
      default: "buyer",
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  // Hash password with strength of 10
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // If user registered via social login and has no password
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
