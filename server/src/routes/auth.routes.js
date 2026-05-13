const express = require("express");
const router = express.Router();

const { register, login, firebaseLogin, getMe, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { authLimiter } = require("../middleware/rateLimiter.middleware");
const { registerSchema, loginSchema, firebaseLoginSchema, updateProfileSchema } = require("../validations/auth.validation");

// Public
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login",    authLimiter, validate(loginSchema),    login);
router.post("/firebase-login", authLimiter, validate(firebaseLoginSchema), firebaseLogin);

// Protected
router.get("/me",      protect, getMe);
router.put("/profile", protect, validate(updateProfileSchema), updateProfile);

module.exports = router;
