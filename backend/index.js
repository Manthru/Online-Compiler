const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const passport = require("./config/passport");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const { protect } = require("./middleware/authMiddleware");

const { generateFile } = require("./generateFile");
const { generateInputFile } = require("./generateInputFile");
const { executeCode } = require("./executeCode");
const { aiCodeReview } = require("./aiCodeReview");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/problems", problemRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ online: "AlgoU API v2" });
});

// ── Compiler ──────────────────────────────────────────────────────────────────
app.post("/run", protect, async (req, res) => {
  const { language = "cpp", code, input } = req.body;
  if (!code) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    const inputPath = await generateInputFile(input);
    const output = await executeCode(filePath, inputPath, language);
    res.json({ output });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── AI Review ─────────────────────────────────────────────────────────────────
app.post("/ai-review", protect, async (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    const review = await aiCodeReview(code);
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: "Error in AI review: " + error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});
