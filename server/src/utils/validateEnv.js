/**
 * Validate that all required environment variables are present.
 * Exits the process if any critical variables are missing.
 */
const validateEnv = () => {
  const required = [
    "MONGO_URI",
    "JWT_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`\n❌ ERROR: Missing required environment variables: ${missing.join(", ")}`);
    console.error("Please check your .env file.\n");
    process.exit(1);
  }

  // Warn about optional but recommended variables
  const recommended = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
  ];

  const missingRecommended = recommended.filter((key) => !process.env[key]);
  if (missingRecommended.length > 0) {
    console.warn(`\n⚠️  WARNING: Missing optional environment variables: ${missingRecommended.join(", ")}`);
    console.warn("Some features (Cloudinary/Firebase) will be disabled.\n");
  }
};

module.exports = validateEnv;
