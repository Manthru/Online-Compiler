const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "Accepted",
        "Wrong Answer",
        "Runtime Error",
        "Time Limit Exceeded",
      ],
      required: true,
    },
    passedTestCases: { type: Number, default: 0 },
    totalTestCases: { type: Number, default: 0 },
    runtime: { type: Number }, // ms
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
