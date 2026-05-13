const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Reward title is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["badge", "coupon", "certificate", "merchandise", "other"],
      default: "badge",
    },
    pointsCost: {
      type: Number,
      required: [true, "Points cost is required"],
      min: 0,
    },
    image: { type: String, default: "" },
    stock: { type: Number, default: -1 }, // -1 = unlimited
    isActive: { type: Boolean, default: true },

    // Who has redeemed this reward
    redeemedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        redeemedAt: { type: Date, default: Date.now },
        couponCode: { type: String, default: "" },
      },
    ],
    totalRedeemed: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);
