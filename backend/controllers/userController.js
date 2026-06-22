const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @PUT /api/user/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    if (req.body.password) {
      if (req.body.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }
      // Hash directly here too
      user.password = await bcrypt.hash(req.body.password, 12);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
      stats: updatedUser.stats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @GET /api/user/stats
const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("stats name email");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile, getStats };
