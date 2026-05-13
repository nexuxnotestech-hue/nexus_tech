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

  // Deduct points and stock atomically
  const wallet = await Wallet.findOneAndUpdate(
    { user: req.user._id, balance: { $gte: reward.pointsCost } },
    { 
      $inc: { balance: -reward.pointsCost },
      $push: {
        transactions: {
          type: "debit",
          amount: reward.pointsCost,
          description: `Redeemed reward: ${reward.title}`,
          reference: reward._id.toString(),
          balanceAfter: 0, // updated below
        }
      }
    },
    { new: true }
  );

  if (!wallet) {
    throw new ApiError(400, "Insufficient points or wallet error");
  }

  // Update balanceAfter
  const lastTx = wallet.transactions[wallet.transactions.length - 1];
  lastTx.balanceAfter = wallet.balance;
  await wallet.save();

  // Deduct stock atomically if limited
  if (reward.stock !== -1) {
    const updatedReward = await Reward.findOneAndUpdate(
      { _id: reward._id, totalRedeemed: { $lt: reward.stock } },
      { $inc: { totalRedeemed: 1 } },
      { new: true }
    );
    if (!updatedReward) {
      // Rollback wallet if stock check fails (simplified rollback)
      await Wallet.findByIdAndUpdate(req.user._id, { $inc: { balance: reward.pointsCost }, $pop: { transactions: 1 } });
      throw new ApiError(400, "Reward just went out of stock");
    }
  } else {
    reward.totalRedeemed += 1;
    await reward.save();
  }

  // Record redemption
  const couponCode = `NX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  await Reward.findByIdAndUpdate(reward._id, {
    $push: { redeemedBy: { user: req.user._id, couponCode } }
  });

  // Update user total points
  await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: -reward.pointsCost } });

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
