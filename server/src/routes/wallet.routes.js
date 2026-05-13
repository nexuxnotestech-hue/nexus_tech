const express = require("express");
const router = express.Router();

const { getWallet, getTransactions } = require("../controllers/wallet.controller");
const { protect } = require("../middleware/auth.middleware");

// All wallet routes are protected
router.get("/",             protect, getWallet);
router.get("/transactions", protect, getTransactions);

module.exports = router;
