const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Problem = require("../models/Problem");
const Submission = require("../models/Submission");
const User = require("../models/User");
const { generateFile } = require("../generateFile");
const { generateInputFile } = require("../generateInputFile");
const { executeCode } = require("../executeCode");

const buildFullCode = (problem, userCode, language) => {
  const hidden = problem.hiddenCode?.[language];
  if (!hidden) return userCode;
  return hidden.replace("{{USER_CODE}}", userCode);
};

const runTestCase = async (fullCode, language, tc) => {
  try {
    const filePath = await generateFile(language, fullCode);
    const inputPath = await generateInputFile(tc.input);
    const startTime = Date.now();
    const output = await executeCode(filePath, inputPath, language);
    const runtime = Date.now() - startTime;
    const passed = output.trim() === tc.output.trim();
    return { passed, output: output.trim(), runtime };
  } catch (err) {
    return { passed: false, output: "", error: err.message };
  }
};

// GET all problems
router.get("/", protect, async (req, res) => {
  try {
    const problems = await Problem.find()
      .select("title slug difficulty tags order")
      .sort({ order: 1 });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single problem
router.get("/:slug", protect, async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug }).select(
      "-hiddenCode",
    );
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET submissions for a problem by current user
router.get("/:slug/submissions", protect, async (req, res) => {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug }).select(
      "_id",
    );
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const submissions = await Submission.find({
      user: req.user._id,
      problem: problem._id,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("status language passedTestCases totalTestCases createdAt code");

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST run
router.post("/:slug/run", protect, async (req, res) => {
  try {
    const { code, language = "cpp" } = req.body;
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const fullCode = buildFullCode(problem, code, language);
    const visibleCases = problem.testCases.filter((tc) => !tc.isHidden);
    const results = [];

    for (const tc of visibleCases) {
      const result = await runTestCase(fullCode, language, tc);
      results.push({
        input: tc.input,
        expectedOutput: tc.output,
        yourOutput: result.output || "",
        passed: result.passed,
        runtime: result.runtime,
        error: result.error,
      });
    }

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST submit
router.post("/:slug/submit", protect, async (req, res) => {
  try {
    const { code, language = "cpp" } = req.body;
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const fullCode = buildFullCode(problem, code, language);
    let passedCount = 0;
    const totalCount = problem.testCases.length;
    let status = "Accepted";
    const results = [];

    for (const tc of problem.testCases) {
      const result = await runTestCase(fullCode, language, tc);

      if (result.error && status === "Accepted") status = "Runtime Error";
      else if (!result.passed && status === "Accepted") status = "Wrong Answer";
      if (result.passed) passedCount++;

      results.push({
        passed: result.passed,
        input: tc.isHidden ? "Hidden" : tc.input,
        expectedOutput: tc.isHidden ? "Hidden" : tc.output,
        yourOutput: tc.isHidden
          ? result.passed
            ? "Correct ✓"
            : "Wrong ✗"
          : result.output || result.error || "",
      });
    }

    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      language,
      status,
      passedTestCases: passedCount,
      totalTestCases: totalCount,
    });

    const inc = { "stats.totalSubmissions": 1 };
    if (status === "Accepted") {
      inc["stats.totalSolved"] = 1;
      inc[`stats.${problem.difficulty.toLowerCase()}Solved`] = 1;
    }
    await User.findByIdAndUpdate(req.user._id, { $inc: inc });

    res.json({
      status,
      passedCount,
      totalCount,
      results,
      submissionId: submission._id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
