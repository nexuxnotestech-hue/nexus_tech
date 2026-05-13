const Leaderboard = require("../models/Leaderboard.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/leaderboard
// @desc    Get global leaderboard (top 100)
// @access  Public
// ─────────────────────────────────────────
const getGlobalLeaderboard = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const entries = await Leaderboard.find()
    .sort({ totalPoints: -1, contestsWon: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("user", "name avatar college department");

  const total = await Leaderboard.countDocuments();

  // Assign rank numbers based on current page
  const ranked = entries.map((entry, i) => ({
    rank: (page - 1) * parseInt(limit) + i + 1,
    user: entry.user,
    totalPoints: entry.totalPoints,
    contestsParticipated: entry.contestsParticipated,
    contestsWon: entry.contestsWon,
  }));

  return res.status(200).json(
    new ApiResponse(200, {
      leaderboard: ranked,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) },
    }, "Global leaderboard fetched")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/leaderboard/me
// @desc    Get current user's rank and stats
// @access  Private
// ─────────────────────────────────────────
const getMyRank = asyncHandler(async (req, res) => {
  const entry = await Leaderboard.findOne({ user: req.user._id });

  if (!entry) {
    return res.status(200).json(
      new ApiResponse(200, { rank: null, totalPoints: 0 }, "No leaderboard entry yet")
    );
  }

  // Calculate rank by counting entries with more points
  const rank = (await Leaderboard.countDocuments({ totalPoints: { $gt: entry.totalPoints } })) + 1;

  return res.status(200).json(
    new ApiResponse(200, {
      rank,
      totalPoints: entry.totalPoints,
      contestsParticipated: entry.contestsParticipated,
      contestsWon: entry.contestsWon,
    }, "Your rank fetched successfully")
  );
});

module.exports = { getGlobalLeaderboard, getMyRank };
