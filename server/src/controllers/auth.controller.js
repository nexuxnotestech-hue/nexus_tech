const bcrypt = require("bcryptjs");
const { getFirebaseAdmin } = require("../config/firebase");
const User = require("../models/User.model");
const Wallet = require("../models/Wallet.model");
const Leaderboard = require("../models/Leaderboard.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");

// Helper: create wallet + leaderboard entry for new user
const initUserResources = async (userId) => {
  await Wallet.create({ user: userId });
  await Leaderboard.create({ user: userId });
};

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register new user (local JWT)
// @access  Public
// ─────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password, college, department } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already registered");

  const user = await User.create({
    name,
    email,
    password,
    college,
    department,
    authProvider: "local",
  });

  await initUserResources(user._id);
  const token = generateToken(user._id);

  return res.status(201).json(
    new ApiResponse(201, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
      },
    }, "Registration successful")
  );
});

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login with email/password (local JWT)
// @access  Public
// ─────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (user.authProvider !== "local") {
    throw new ApiError(400, `Please login with ${user.authProvider}`);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (user.isBanned) throw new ApiError(403, "Your account has been banned");

  const token = generateToken(user._id);

  return res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
      },
    }, "Login successful")
  );
});

// ─────────────────────────────────────────
// @route   POST /api/auth/firebase-login
// @desc    Login/Register via Firebase (Google, etc.)
// @access  Public
// ─────────────────────────────────────────
const firebaseLogin = asyncHandler(async (req, res) => {
  const { idToken, name: reqName } = req.body;

  // Verify Firebase token
  const firebaseAdmin = getFirebaseAdmin();
  if (!firebaseAdmin) throw new ApiError(503, "Firebase authentication is not configured on this server");

  const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
  const { uid, email, name: firebaseName, picture } = decoded;

  let user = await User.findOne({ firebaseUid: uid });

  if (!user) {
    // New user — create account
    user = await User.create({
      firebaseUid: uid,
      name: reqName || firebaseName || "Nexus User",
      email,
      avatar: picture || "",
      authProvider: decoded.firebase?.sign_in_provider === "google.com" ? "google" : "firebase",
      isEmailVerified: decoded.email_verified || false,
    });
    await initUserResources(user._id);
  }

  if (user.isBanned) throw new ApiError(403, "Your account has been banned");

  // Return a local JWT for subsequent API calls (Firebase token is short-lived)
  const token = generateToken(user._id);

  return res.status(200).json(
    new ApiResponse(200, {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
      },
    }, "Firebase login successful")
  );
});

// ─────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user
// @access  Private
// ─────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  return res.status(200).json(new ApiResponse(200, { user }, "User fetched successfully"));
});

// ─────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// ─────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, college, department, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, college, department, avatar },
    { new: true, runValidators: true }
  );

  return res.status(200).json(new ApiResponse(200, { user }, "Profile updated successfully"));
});

module.exports = { register, login, firebaseLogin, getMe, updateProfile };
