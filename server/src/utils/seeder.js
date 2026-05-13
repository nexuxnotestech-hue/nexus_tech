require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const Contest = require("../models/Contest.model");
const Reward = require("../models/Reward.model");
const Wallet = require("../models/Wallet.model");
const Leaderboard = require("../models/Leaderboard.model");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // 1. Clear existing data
    await User.deleteMany();
    await Contest.deleteMany();
    await Reward.deleteMany();
    await Wallet.deleteMany();
    await Leaderboard.deleteMany();
    console.log("Cleared existing data.");

    // 2. Create Admin User
    const admin = await User.create({
      name: "Super Admin",
      email: "admin@nexustech.com",
      password: "admin123",
      role: "admin",
      authProvider: "local",
    });
    await Wallet.create({ user: admin._id, balance: 1000 });
    await Leaderboard.create({ user: admin._id, totalPoints: 1000 });

    // 3. Create Sample Contests
    await Contest.create([
      {
        title: "JavaScript Fundamentals Quiz",
        description: "Test your basic JS knowledge and earn points!",
        category: "quiz",
        difficulty: "easy",
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
        isPublished: true,
        pointsForParticipation: 20,
        createdBy: admin._id,
        questions: [
          {
            questionText: "What is the output of '2' + 2?",
            options: ["4", "22", "undefined", "Error"],
            correctAnswer: 1,
            points: 10
          },
          {
            questionText: "Which keyword is used to define a constant in JS?",
            options: ["var", "let", "const", "def"],
            correctAnswer: 2,
            points: 10
          }
        ]
      },
      {
        title: "Weekly UI Challenge",
        description: "Design a landing page for a tech startup.",
        category: "design",
        difficulty: "medium",
        startTime: new Date(),
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "active",
        isPublished: true,
        pointsForParticipation: 50,
        createdBy: admin._id
      }
    ]);

    // 4. Create Sample Rewards
    await Reward.create([
      {
        title: "Nexus Tech Pro Badge",
        description: "Exclusive badge for top performers",
        category: "badge",
        pointsCost: 500,
        isActive: true,
        createdBy: admin._id
      },
      {
        title: "Amazon Gift Card $10",
        description: "Redeemable on Amazon.com",
        category: "coupon",
        pointsCost: 2000,
        stock: 5,
        isActive: true,
        createdBy: admin._id
      }
    ]);

    console.log("✅ Database successfully seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
