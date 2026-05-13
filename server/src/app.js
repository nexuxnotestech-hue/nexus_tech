const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Route imports
const authRoutes        = require("./routes/auth.routes");
const contestRoutes     = require("./routes/contest.routes");
const walletRoutes      = require("./routes/wallet.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const rewardRoutes      = require("./routes/reward.routes");
const adminRoutes       = require("./routes/admin.routes");
const uploadRoutes      = require("./routes/upload.routes");


// Middleware imports
const errorHandler      = require("./middleware/errorHandler.middleware");
const { apiLimiter }    = require("./middleware/rateLimiter.middleware");

const app = express();

// ─────────────────────────────────────────
// GLOBAL MIDDLEWARE
// ─────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// HTTP request logger (only in dev)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global rate limiter
app.use("/api", apiLimiter);

// ─────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Nexus Tech Contest API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API healthy", uptime: process.uptime() });
});

// ─────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────
app.use("/api/auth",        authRoutes);
app.use("/api/contests",    contestRoutes);
app.use("/api/wallet",      walletRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/rewards",     rewardRoutes);
app.use("/api/admin",       adminRoutes);
app.use("/api/upload",      uploadRoutes);


// ─────────────────────────────────────────
// 404 HANDLER
// ─────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────
// GLOBAL ERROR HANDLER (must be last)
// ─────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
