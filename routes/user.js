const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user");
const asyncHandler = require("express-async-handler");
const { isLogin, validateUser } = require("../middleware/auth");

// User registration
router.post(
  "/register",
  validateUser,
  asyncHandler(userControllers.registerUser)
);
// User login
router.post("/login", asyncHandler(userControllers.loginUser));
// Get user information
router.get("/profile", isLogin, asyncHandler(userControllers.getUserInfo));
// Update user information
router.put("/editProfile", isLogin, asyncHandler(userControllers.updateUser));
// Send reset password email
router.post(
  "/sendResetPasswordEmail",
  asyncHandler(userControllers.sendResetPasswordEmail)
);
// Reset password
router.post("/resetPassword", asyncHandler(userControllers.resetPassword));
// Verify email
router.post("/verify", asyncHandler(userControllers.verifyEmail));

module.exports = router;
