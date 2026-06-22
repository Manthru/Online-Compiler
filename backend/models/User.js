const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    googleId: { type: String },
    profilePicture: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    stats: {
      totalSolved: { type: Number, default: 0 },
      easySolved: { type: Number, default: 0 },
      mediumSolved: { type: Number, default: 0 },
      hardSolved: { type: Number, default: 0 },
      totalSubmissions: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      aiReviewsUsed: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
