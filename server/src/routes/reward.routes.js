const express = require("express");
const router = express.Router();

const { getAllRewards, redeemReward, getMyRewards } = require("../controllers/reward.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { redeemRewardSchema } = require("../validations/wallet.validation");

// Public
router.get("/", getAllRewards);

// Protected
router.get("/my-rewards",              protect, getMyRewards);
router.post("/:rewardId/redeem",       protect, validate(redeemRewardSchema), redeemReward);

module.exports = router;
