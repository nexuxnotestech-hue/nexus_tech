const admin = require("firebase-admin");

let firebaseApp = null;

/**
 * Lazy Firebase initialization — only initializes when first used.
 * This prevents startup crash when Firebase credentials are not yet configured.
 */
const getFirebaseAdmin = () => {
  if (firebaseApp) return firebaseApp;

  const { FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_PRIVATE_KEY || !FIREBASE_CLIENT_EMAIL) {
    console.warn("⚠️  Firebase credentials not configured — Firebase auth disabled");
    return null;
  }

  try {
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          clientEmail: FIREBASE_CLIENT_EMAIL,
        }),
      });
    } else {
      firebaseApp = admin.app();
    }
    console.log("✅ Firebase Admin SDK initialized");
    return firebaseApp;
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error.message);
    return null;
  }
};

module.exports = { getFirebaseAdmin, admin };
