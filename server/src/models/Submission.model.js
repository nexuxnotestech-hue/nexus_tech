const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Quiz Answers
    answers: [
      {
        questionIndex: { type: Number },
        selectedOption: { type: Number },
        isCorrect: { type: Boolean },
        pointsEarned: { type: Number, default: 0 },
      },
    ],

    // Code submission (for coding contests)
    code: { type: String, default: "" },
    language: { type: String, default: "" },

    // Scoring
    totalScore: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    timeTakenSeconds: { type: Number, default: 0 },

    // Rank in this contest
    contestRank: { type: Number, default: 0 },

    // Status
    status: {
      type: String,
      enum: ["submitted", "evaluated", "disqualified"],
      default: "submitted",
    },

    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate submissions
submissionSchema.index({ contest: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
