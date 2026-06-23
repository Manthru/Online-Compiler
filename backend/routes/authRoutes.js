const express = require("express");
const router = express.Router();
const { signup, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Local auth routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

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
      failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    }),
    (req, res) => {
      try {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
      } catch (err) {
        console.error("Google callback error:", err);
        res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
      }
    },
  );
} else {
  router.get("/google", (req, res) => {
    res.status(503).json({ message: "Google OAuth not configured." });
  });
}

module.exports = router;
