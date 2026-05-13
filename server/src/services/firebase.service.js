const { getFirebaseAdmin } = require("../config/firebase");
const ApiError = require("../utils/ApiError");

/**
 * Verify a Firebase ID token
 */
const verifyFirebaseToken = async (idToken) => {
  const firebaseAdmin = getFirebaseAdmin();
  if (!firebaseAdmin) throw new ApiError(503, "Firebase authentication is not configured");

  try {
    return await firebaseAdmin.auth().verifyIdToken(idToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired Firebase token");
  }
};

/**
 * Get Firebase user by UID
 */
const getFirebaseUser = async (uid) => {
  const firebaseAdmin = getFirebaseAdmin();
  if (!firebaseAdmin) throw new ApiError(503, "Firebase authentication is not configured");

  try {
    return await firebaseAdmin.auth().getUser(uid);
  } catch (error) {
    throw new ApiError(404, "Firebase user not found");
  }
};

/**
 * Revoke all refresh tokens for a user (force logout)
 */
const revokeUserTokens = async (uid) => {
  const firebaseAdmin = getFirebaseAdmin();
  if (!firebaseAdmin) throw new ApiError(503, "Firebase authentication is not configured");

  try {
    await firebaseAdmin.auth().revokeRefreshTokens(uid);
  } catch (error) {
    throw new ApiError(500, "Failed to revoke user tokens");
  }
};

module.exports = { verifyFirebaseToken, getFirebaseUser, revokeUserTokens };
