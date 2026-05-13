const Contest = require("../models/Contest.model");
const Submission = require("../models/Submission.model");
const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Leaderboard = require("../models/Leaderboard.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// ─────────────────────────────────────────
// @route   GET /api/contests
// @desc    Get all published contests (with pagination & filters)
// @access  Public
// ─────────────────────────────────────────
const getAllContests = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, category, difficulty, search } = req.query;

  const filter = { isPublished: true };
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (search) filter.title = { $regex: search, $options: "i" };

  const contests = await Contest.find(filter)
    .sort({ startTime: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate("createdBy", "name avatar")
    .select("-questions");

  const total = await Contest.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(200, {
      contests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    }, "Contests fetched successfully")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/contests/:id
// @desc    Get single contest details
// @access  Public
// ─────────────────────────────────────────
const getContestById = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id).populate("createdBy", "name avatar");
  if (!contest) throw new ApiError(404, "Contest not found");

  // Hide correct answers unless contest has ended
  let data = contest.toObject();
  if (data.status !== "ended") {
    data.questions = data.questions?.map(({ correctAnswer, ...q }) => q);
  }

  return res.status(200).json(new ApiResponse(200, { contest: data }, "Contest fetched successfully"));
});

// ─────────────────────────────────────────
// @route   POST /api/contests/:id/join
// @desc    Join a contest
// @access  Private
// ─────────────────────────────────────────
const joinContest = asyncHandler(async (req, res) => {
  const contest = await Contest.findById(req.params.id);
  if (!contest) throw new ApiError(404, "Contest not found");
  if (contest.status !== "active") throw new ApiError(400, "This contest is not active");

  if (contest.participants.includes(req.user._id)) {
    throw new ApiError(400, "You have already joined this contest");
  }

  if (contest.maxParticipants > 0 && contest.participantCount >= contest.maxParticipants) {
    throw new ApiError(400, "Contest is full");
  }

  contest.participants.push(req.user._id);
  contest.participantCount += 1;
  await contest.save();

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, { $inc: { contestsParticipated: 1 } });

  // Award participation points
  if (contest.pointsForParticipation > 0) {
    const points = contest.pointsForParticipation;
    
    // Atomic update to wallet
    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { 
        $inc: { balance: points },
        $push: {
          transactions: {
            type: "credit",
            amount: points,
            description: `Participation in: ${contest.title}`,
            reference: contest._id.toString(),
            balanceAfter: 0, // Placeholder, see note below
          }
        }
      },
      { new: true }
    );

    if (wallet) {
      // Fix balanceAfter in the last transaction
      const lastTx = wallet.transactions[wallet.transactions.length - 1];
      lastTx.balanceAfter = wallet.balance;
      await wallet.save();

      // Atomic update to user and leaderboard
      await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: points } });
      await Leaderboard.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { totalPoints: points, contestsParticipated: 1 } }
      );
    }
  }

  return res.status(200).json(new ApiResponse(200, {}, "Joined contest successfully"));
});

// ─────────────────────────────────────────
// @route   POST /api/contests/:id/submit
// @desc    Submit answers for a quiz contest
// @access  Private
// ─────────────────────────────────────────
const submitAnswers = asyncHandler(async (req, res) => {
  const { answers, timeTakenSeconds } = req.body;

  const contest = await Contest.findById(req.params.id);
  if (!contest) throw new ApiError(404, "Contest not found");
  if (contest.status !== "active") throw new ApiError(400, "This contest is not accepting submissions");

  if (!contest.participants.includes(req.user._id)) {
    throw new ApiError(403, "You must join the contest before submitting");
  }

  const existing = await Submission.findOne({ contest: contest._id, user: req.user._id });
  if (existing) throw new ApiError(400, "You have already submitted for this contest");

  // Grade answers
  let totalScore = 0;
  let correctCount = 0;
  const gradedAnswers = answers.map((ans) => {
    const question = contest.questions[ans.questionIndex];
    if (!question) {
       // Silently ignore or handle invalid index
       return { ...ans, isCorrect: false, pointsEarned: 0 };
    }
    const isCorrect = question.correctAnswer === ans.selectedOption;
    const pts = isCorrect ? (question.points || 10) : 0;
    totalScore += pts;
    if (isCorrect) correctCount++;
    return { ...ans, isCorrect, pointsEarned: pts };
  });

  const submission = await Submission.create({
    contest: contest._id,
    user: req.user._id,
    answers: gradedAnswers,
    totalScore,
    correctAnswers: correctCount,
    totalQuestions: contest.questions.length,
    timeTakenSeconds: timeTakenSeconds || 0,
    status: "evaluated",
  });

  // Credit winning points if score > 0
  if (totalScore > 0) {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (wallet) {
      wallet.balance += totalScore;
      wallet.transactions.push({
        type: "credit",
        amount: totalScore,
        description: `Score in: ${contest.title}`,
        reference: contest._id.toString(),
        balanceAfter: wallet.balance,
      });
      await wallet.save();

      await User.findByIdAndUpdate(req.user._id, { $inc: { totalPoints: totalScore } });
      await Leaderboard.findOneAndUpdate(
        { user: req.user._id },
        { $inc: { totalPoints: totalScore } }
      );
    }
  }

  return res.status(201).json(
    new ApiResponse(201, {
      submission: {
        totalScore,
        correctAnswers: correctCount,
        totalQuestions: contest.questions.length,
        timeTakenSeconds,
      },
    }, "Submission successful")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/contests/:id/my-submission
// @desc    Get my submission for a contest
// @access  Private
// ─────────────────────────────────────────
const getMySubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findOne({
    contest: req.params.id,
    user: req.user._id,
  });

  if (!submission) throw new ApiError(404, "No submission found");

  return res.status(200).json(new ApiResponse(200, { submission }, "Submission fetched"));
});

// ─────────────────────────────────────────
// @route   GET /api/contests/:id/leaderboard
// @desc    Get contest-level leaderboard (top submissions)
// @access  Public
// ─────────────────────────────────────────
const getContestLeaderboard = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ contest: req.params.id, status: "evaluated" })
    .sort({ totalScore: -1, timeTakenSeconds: 1 })
    .limit(50)
    .populate("user", "name avatar college");

  const ranked = submissions.map((s, i) => ({
    rank: i + 1,
    user: s.user,
    score: s.totalScore,
    correctAnswers: s.correctAnswers,
    totalQuestions: s.totalQuestions,
    timeTaken: s.timeTakenSeconds,
  }));

  return res.status(200).json(new ApiResponse(200, { leaderboard: ranked }, "Contest leaderboard fetched"));
});

module.exports = {
  getAllContests,
  getContestById,
  joinContest,
  submitAnswers,
  getMySubmission,
  getContestLeaderboard,
};
