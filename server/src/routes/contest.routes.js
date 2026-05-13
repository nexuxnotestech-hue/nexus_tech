const express = require("express");
const router = express.Router();

const {
  getAllContests,
  getContestById,
  joinContest,
  submitAnswers,
  getMySubmission,
  getContestLeaderboard,
} = require("../controllers/contest.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { submitAnswerSchema } = require("../validations/contest.validation");

// Public
router.get("/", getAllContests);
router.get("/:id", getContestById);
router.get("/:id/leaderboard", getContestLeaderboard);

// Protected
router.post("/:id/join",          protect, joinContest);
router.post("/:id/submit",        protect, validate(submitAnswerSchema), submitAnswers);
router.get("/:id/my-submission",  protect, getMySubmission);

module.exports = router;
