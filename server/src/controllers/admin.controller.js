const Contest = require("../models/Contest.model");
const User = require("../models/User.model");
const Submission = require("../models/Submission.model");
const Reward = require("../models/Reward.model");
const Wallet = require("../models/Wallet.model");
const Leaderboard = require("../models/Leaderboard.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/admin/dashboard
// @desc    Admin dashboard stats
// @access  Admin
// ─────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalContests,
    activeContests,
    totalSubmissions,
    totalRewards,
  ] = await Promise.all([
    User.countDocuments(),
    Contest.countDocuments(),
    Contest.countDocuments({ status: "active" }),
    Submission.countDocuments(),
    Reward.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalContests,
      activeContests,
      totalSubmissions,
      totalRewards,
    }, "Dashboard stats fetched")
  );
});

// ─────────────────────────────────────────
// CONTEST MANAGEMENT
// ─────────────────────────────────────────

// @route   POST /api/admin/contests
const createContest = asyncHandler(async (req, res) => {
  const contest = await Contest.create({ ...req.body, createdBy: req.user._id });
  return res.status(201).json(new ApiResponse(201, { contest }, "Contest created successfully"));
});

// @route   PUT /api/admin/contests/:id
const updateContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contest) throw new ApiError(404, "Contest not found");
  return res.status(200).json(new ApiResponse(200, { contest }, "Contest updated successfully"));
});

// @route   DELETE /api/admin/contests/:id
const deleteContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findByIdAndDelete(req.params.id);
  if (!contest) throw new ApiError(404, "Contest not found");
  await Submission.deleteMany({ contest: req.params.id });
  return res.status(200).json(new ApiResponse(200, {}, "Contest deleted successfully"));
});

// @route   PATCH /api/admin/contests/:id/publish
const publishContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findByIdAndUpdate(
    req.params.id,
    { isPublished: true, status: "upcoming" },
    { new: true }
  );
  if (!contest) throw new ApiError(404, "Contest not found");
  return res.status(200).json(new ApiResponse(200, { contest }, "Contest published"));
});

// @route   PATCH /api/admin/contests/:id/status
const updateContestStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["upcoming", "active", "ended", "cancelled"];
  if (!allowed.includes(status)) throw new ApiError(400, "Invalid status");

  const contest = await Contest.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!contest) throw new ApiError(404, "Contest not found");
  return res.status(200).json(new ApiResponse(200, { contest }, `Contest marked as ${status}`));
});

// ─────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────

// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (search) filter.$or = [
    { name: { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
  ];

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, { users, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } }, "Users fetched")
  );
});

// @route   PATCH /api/admin/users/:id/ban
const banUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, {}, "User banned successfully"));
});

// @route   PATCH /api/admin/users/:id/unban
const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, {}, "User unbanned successfully"));
});

// @route   PATCH /api/admin/users/:id/role
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) throw new ApiError(400, "Invalid role");
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, { user }, "Role updated"));
});

// ─────────────────────────────────────────
// REWARD MANAGEMENT
// ─────────────────────────────────────────

// @route   POST /api/admin/rewards
const createReward = asyncHandler(async (req, res) => {
  const reward = await Reward.create({ ...req.body, createdBy: req.user._id });
  return res.status(201).json(new ApiResponse(201, { reward }, "Reward created"));
});

// @route   PUT /api/admin/rewards/:id
const updateReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!reward) throw new ApiError(404, "Reward not found");
  return res.status(200).json(new ApiResponse(200, { reward }, "Reward updated"));
});

// @route   DELETE /api/admin/rewards/:id
const deleteReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndDelete(req.params.id);
  if (!reward) throw new ApiError(404, "Reward not found");
  return res.status(200).json(new ApiResponse(200, {}, "Reward deleted"));
});

module.exports = {
  getDashboardStats,
  createContest, updateContest, deleteContest, publishContest, updateContestStatus,
  getAllUsers, banUser, unbanUser, changeUserRole,
  createReward, updateReward, deleteReward,
};
