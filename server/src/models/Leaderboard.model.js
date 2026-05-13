const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema(
  {
    // Global leaderboard entry per user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalPoints: { type: Number, default: 0 },
    contestsParticipated: { type: Number, default: 0 },
    contestsWon: { type: Number, default: 0 },
    globalRank: { type: Number, default: 0 },

    // Per-contest breakdown (optional, for detailed view)
    contestHistory: [
      {
        contest: { type: mongoose.Schema.Types.ObjectId, ref: "Contest" },
        score: { type: Number },
        rank: { type: Number },
        pointsEarned: { type: Number },
        participatedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
