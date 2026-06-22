const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// @POST /api/auth/signup
const signup = async (req, res) => {
  try {
    console.log("📥 Signup request body:", req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    console.log("🔍 Checking if email exists:", email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password directly here — no pre-save hook needed
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log("✅ Creating user...");
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("✅ User created:", user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      stats: user.stats,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    console.error("❌ Full error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @POST /api/auth/login
const login = async (req, res) => {
  try {
    console.log("📥 Login request body:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password directly here
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      stats: user.stats,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login, getMe };
