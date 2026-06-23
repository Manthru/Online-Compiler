const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (
  !clientID ||
  !clientSecret ||
  clientID === "skip" ||
  clientSecret === "skip"
) {
  console.warn("⚠️  Google OAuth not configured — skipping Google strategy.");
  module.exports = passport;
} else {
  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        // ← Use full URL not relative path
        callbackURL:
          "https://algou-backend.onrender.com/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          if (!user) {
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              user.profilePicture = profile.photos[0].value;
              await user.save();
            } else {
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePicture: profile.photos[0].value,
              });
            }
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      },
    ),
  );
  module.exports = passport;
}
