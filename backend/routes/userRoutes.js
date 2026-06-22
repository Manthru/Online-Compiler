const express = require("express");
const router = express.Router();
const { updateProfile, getStats } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.put("/profile", protect, updateProfile);
router.get("/stats", protect, getStats);

module.exports = router;
