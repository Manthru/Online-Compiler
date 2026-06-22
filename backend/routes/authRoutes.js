// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Local auth routes — always available
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

// Google OAuth — only register if credentials are configured
const googleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "skip" &&
  process.env.GOOGLE_CLIENT_SECRET !== "skip";

if (googleConfigured) {
  const passport = require("passport");
  const jwt = require("jsonwebtoken");

  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/login",
    }),
    (req, res) => {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
    },
  );
} else {
  // Return clear error if Google not configured
  router.get("/google", (req, res) => {
    res.status(503).json({
      message: "Google OAuth is not configured yet. Use email/password login.",
    });
  });
}

module.exports = router;
