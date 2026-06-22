const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
  isHidden: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [{ type: String }],
    constraints: [{ type: String }],
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    testCases: [testCaseSchema],
    // What user sees in the editor
    starterCode: {
      cpp: { type: String },
      c: { type: String },
      python: { type: String },
    },
    // Full code with main() — {{USER_CODE}} gets replaced with user's solution
    hiddenCode: {
      cpp: { type: String },
      c: { type: String },
      python: { type: String },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Problem", problemSchema);
