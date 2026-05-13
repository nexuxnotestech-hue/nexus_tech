const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  createContest, updateContest, deleteContest, publishContest, updateContestStatus,
  getAllUsers, banUser, unbanUser, changeUserRole,
  createReward, updateReward, deleteReward,
} = require("../controllers/admin.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const { createContestSchema } = require("../validations/contest.validation");

// All admin routes require auth + admin role
router.use(protect, authorizeRoles("admin"));

// Dashboard
router.get("/dashboard", getDashboardStats);

// Contest management
router.post("/contests",                createContest);
router.put("/contests/:id",             updateContest);
router.delete("/contests/:id",          deleteContest);
router.patch("/contests/:id/publish",   publishContest);
router.patch("/contests/:id/status",    updateContestStatus);

// User management
router.get("/users",                    getAllUsers);
router.patch("/users/:id/ban",          banUser);
router.patch("/users/:id/unban",        unbanUser);
router.patch("/users/:id/role",         changeUserRole);

// Reward management
router.post("/rewards",                 createReward);
router.put("/rewards/:id",              updateReward);
router.delete("/rewards/:id",           deleteReward);

module.exports = router;
