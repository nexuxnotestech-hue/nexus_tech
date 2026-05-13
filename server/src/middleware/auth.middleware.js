const jwt = require("jsonwebtoken");
const { getFirebaseAdmin } = require("../config/firebase");
const User = require("../models/User.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Protect routes — supports both JWT (local) and Firebase ID token.
 * Attaches req.user after successful verification.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Not authorized — no token provided");
  }

  // ── 1. Try Firebase token first ──────────────────────────────
  const firebaseAdmin = getFirebaseAdmin();
  if (firebaseAdmin) {
    try {
      const decoded = await firebaseAdmin.auth().verifyIdToken(token);
      const user = await User.findOne({ firebaseUid: decoded.uid });

      if (user) {
        if (user.isBanned) throw new ApiError(403, "Your account has been banned");
        req.user = user;
        return next();
      }
      // uid found in Firebase but no DB record → fall through to JWT
    } catch (firebaseError) {
      if (firebaseError instanceof ApiError) throw firebaseError;
      // Not a Firebase token — try JWT below
    }
  }

  // ── 2. Try local JWT ─────────────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new ApiError(401, "User not found — please login again");
    if (user.isBanned) throw new ApiError(403, "Your account has been banned");

    req.user = user;
    return next();
  } catch (jwtError) {
    if (jwtError instanceof ApiError) throw jwtError;
    throw new ApiError(401, "Not authorized — invalid or expired token");
  }
});

module.exports = { protect };
