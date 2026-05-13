const Reward = require("../models/Reward.model");
const Wallet = require("../models/Wallet.model");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/rewards
// @desc    Get all active rewards
// @access  Public
// ─────────────────────────────────────────
const getAllRewards = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;

  const rewards = await Reward.find(filter).sort({ pointsCost: 1 }).select("-redeemedBy");

  return res.status(200).json(new ApiResponse(200, { rewards }, "Rewards fetched successfully"));
});

// ─────────────────────────────────────────
// @route   POST /api/rewards/:rewardId/redeem
// @desc    Redeem a reward using wallet points
// @access  Private
// ─────────────────────────────────────────
const redeemReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.rewardId);
  if (!reward) throw new ApiError(404, "Reward not found");
  if (!reward.isActive) throw new ApiError(400, "This reward is no longer available");

  // Check stock
  if (reward.stock !== -1 && reward.totalRedeemed >= reward.stock) {
    throw new ApiError(400, "Reward is out of stock");
  }

  // Check if already redeemed
  const alreadyRedeemed = reward.redeemedBy.some(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyRedeemed) throw new ApiError(400, "You have already redeemed this reward");

  // Check wallet balance
  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");
  if (wallet.balance < reward.pointsCost) {
    throw new ApiError(400, `Insufficient points. You need ${reward.pointsCost} but have ${wallet.balance}`);
  }

  // Deduct points
  wallet.balance -= reward.pointsCost;
  wallet.transactions.push({
    type: "debit",
    amount: reward.pointsCost,
    description: `Redeemed reward: ${reward.title}`,
    reference: reward._id.toString(),
    balanceAfter: wallet.balance,
  });
  await wallet.save();

  // Update user total points
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: -reward.pointsCost } });

  // Record redemption
  const couponCode = `NX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  reward.redeemedBy.push({ user: req.user._id, couponCode });
  reward.totalRedeemed += 1;
  await reward.save();

  return res.status(200).json(
    new ApiResponse(200, {
      couponCode,
      pointsDeducted: reward.pointsCost,
      remainingBalance: wallet.balance,
    }, "Reward redeemed successfully!")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/rewards/my-rewards
// @desc    Get all rewards redeemed by current user
// @access  Private
// ─────────────────────────────────────────
const getMyRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find({
    "redeemedBy.user": req.user._id,
  }).select("title description category image redeemedBy");

  const myRewards = rewards.map((r) => {
    const entry = r.redeemedBy.find((e) => e.user.toString() === req.user._id.toString());
    return {
      _id: r._id,
      title: r.title,
      description: r.description,
      category: r.category,
      image: r.image,
      couponCode: entry?.couponCode,
      redeemedAt: entry?.redeemedAt,
    };
  });

  return res.status(200).json(new ApiResponse(200, { rewards: myRewards }, "Your rewards fetched"));
});

module.exports = { getAllRewards, redeemReward, getMyRewards };
