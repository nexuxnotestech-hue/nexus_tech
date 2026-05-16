const express = require("express");
const router = express.Router();

const { getGlobalLeaderboard, getMyRank } = require("../controllers/leaderboard.controller");
const { protect } = require("../middleware/auth.middleware");

// Public
router.get("/", getGlobalLeaderboard);

// Protected
router.get("/me", protect, getMyRank);

module.exports = router;
