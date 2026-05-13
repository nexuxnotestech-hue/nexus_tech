const Leaderboard = require("../models/Leaderboard.model");
const User = require("../models/User.model");

/**
 * Recalculate and update global ranks for ALL users
 * Run this after every contest ends or on a cron schedule
 */
const recalculateGlobalRanks = async () => {
  try {
    // Sort by totalPoints DESC, contestsWon DESC
    const entries = await Leaderboard.find().sort({ totalPoints: -1, contestsWon: -1 });

    const bulkOps = entries.map((entry, index) => ({
      updateOne: {
        filter: { _id: entry._id },
        update: { globalRank: index + 1 },
      },
    }));

    if (bulkOps.length > 0) {
      await Leaderboard.bulkWrite(bulkOps);

      // Also update rank on User documents
      const userBulkOps = entries.map((entry, index) => ({
        updateOne: {
          filter: { _id: entry.user },
          update: { rank: index + 1 },
        },
      }));
      await User.bulkWrite(userBulkOps);
    }

    console.log(`✅ Global ranks recalculated for ${entries.length} users`);
  } catch (error) {
    console.error("❌ Error recalculating global ranks:", error.message);
  }
};

/**
 * Add a contest result to a user's leaderboard history
 */
const addContestHistory = async (userId, contestId, score, rank, pointsEarned) => {
  try {
    await Leaderboard.findOneAndUpdate(
      { user: userId },
      {
        $push: {
          contestHistory: {
            contest: contestId,
            score,
            rank,
            pointsEarned,
            participatedAt: new Date(),
          },
        },
        $inc: {
          totalPoints: pointsEarned,
          contestsParticipated: 1,
          ...(rank === 1 ? { contestsWon: 1 } : {}),
        },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error("❌ Error adding contest history:", error.message);
  }
};

module.exports = { recalculateGlobalRanks, addContestHistory };
