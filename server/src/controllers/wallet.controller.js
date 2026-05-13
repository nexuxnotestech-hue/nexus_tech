const Wallet = require("../models/Wallet.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/wallet
// @desc    Get current user's wallet balance & history
// @access  Private
// ─────────────────────────────────────────
const getWallet = asyncHandler(async (req, res) => {
  let wallet = await Wallet.findOne({ user: req.user._id });

  if (!wallet) {
    wallet = await Wallet.create({ user: req.user._id });
  }

  // Return recent 20 transactions (most recent first)
  const recentTransactions = wallet.transactions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  return res.status(200).json(
    new ApiResponse(200, {
      balance: wallet.balance,
      transactions: recentTransactions,
    }, "Wallet fetched successfully")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/wallet/transactions
// @desc    Get full paginated transaction history
// @access  Private
// ─────────────────────────────────────────
const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const wallet = await Wallet.findOne({ user: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  const sorted = wallet.transactions.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const total = sorted.length;
  const paginated = sorted.slice((page - 1) * limit, page * limit);

  return res.status(200).json(
    new ApiResponse(200, {
      transactions: paginated,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }, "Transactions fetched successfully")
  );
});

module.exports = { getWallet, getTransactions };
