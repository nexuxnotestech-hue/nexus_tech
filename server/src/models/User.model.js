const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Firebase UID — primary identifier from Firebase Auth
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Basic Info
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      select: false, // Hidden by default (used when NOT using Firebase)
      minlength: 6,
    },
    avatar: {
      type: String,
      default: "",
    },

    // Role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Profile
    bio: { type: String, default: "", maxlength: 200 },
    college: { type: String, default: "" },
    department: { type: String, default: "" },

    // Stats
    totalPoints: { type: Number, default: 0 },
    contestsParticipated: { type: Number, default: 0 },
    contestsWon: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },

    // Account Status
    isActive: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },

    // Auth via Firebase or JWT
    authProvider: {
      type: String,
      enum: ["local", "firebase", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = require("bcryptjs");
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
