const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Contest title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: true,
      enum: ["coding", "quiz", "design", "hackathon", "other"],
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    // Timing
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    duration: { type: Number }, // in minutes (auto calculated)

    // Status
    status: {
      type: String,
      enum: ["upcoming", "active", "ended", "cancelled"],
      default: "upcoming",
    },

    // Rewards
    prizePool: { type: Number, default: 0 },
    pointsForParticipation: { type: Number, default: 10 },
    pointsForWinning: { type: Number, default: 100 },
    rewards: [
      {
        rank: { type: Number },
        points: { type: Number },
        badge: { type: String },
      },
    ],

    // Questions (for quiz contests)
    questions: [
      {
        questionText: { type: String },
        options: [{ type: String }],
        correctAnswer: { type: Number }, // index of correct option
        points: { type: Number, default: 10 },
      },
    ],

    // Participants
    maxParticipants: { type: Number, default: 0 }, // 0 = unlimited
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    participantCount: { type: Number, default: 0 },

    // Admin
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },

    // Tags
    tags: [{ type: String }],

    // Cover Image
    coverImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-calculate duration before save
contestSchema.pre("save", function (next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round(
      (new Date(this.endTime) - new Date(this.startTime)) / (1000 * 60)
    );
  }
  next();
});

module.exports = mongoose.model("Contest", contestSchema);
