const Wallet = require("../models/Wallet.model");
const User = require("../models/User.model");
const Leaderboard = require("../models/Leaderboard.model");

/**
 * Credit points to a user's wallet
 * @param {string} userId
 * @param {number} amount
 * @param {string} description
 * @param {string} reference - contestId, rewardId, etc.
 */
const creditPoints = async (userId, amount, description = "", reference = "") => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error(`Wallet not found for user ${userId}`);

  wallet.balance += amount;
  wallet.transactions.push({
    type: "credit",
    amount,
    description,
    reference,
    balanceAfter: wallet.balance,
  });

  await wallet.save();

  // Sync totalPoints on User and Leaderboard
  await User.findByIdAndUpdate(userId, { $inc: { totalPoints: amount } });
  await Leaderboard.findOneAndUpdate(
    { user: userId },
    { $inc: { totalPoints: amount } }
  );

  return wallet;
};

/**
 * Debit points from a user's wallet
 * @param {string} userId
 * @param {number} amount
 * @param {string} description
 * @param {string} reference
 */
const debitPoints = async (userId, amount, description = "", reference = "") => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error(`Wallet not found for user ${userId}`);
  if (wallet.balance < amount) throw new Error("Insufficient wallet balance");

  wallet.balance -= amount;
  wallet.transactions.push({
    type: "debit",
    amount,
    description,
    reference,
    balanceAfter: wallet.balance,
  });

  await wallet.save();

  // Sync totalPoints on User and Leaderboard
  await User.findByIdAndUpdate(userId, { $inc: { totalPoints: -amount } });
  await Leaderboard.findOneAndUpdate(
    { user: userId },
    { $inc: { totalPoints: -amount } }
  );

  return wallet;
};

/**
 * Get wallet balance for a user
 */
const getBalance = async (userId) => {
  const wallet = await Wallet.findOne({ user: userId });
  return wallet ? wallet.balance : 0;
};

module.exports = { creditPoints, debitPoints, getBalance };
