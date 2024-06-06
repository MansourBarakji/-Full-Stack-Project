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
// Send reset password email
router.get(
  "/sendResetPasswordEmail",
  asyncHandler(userControllers.sendResetPasswordEmail)
);
// Reset password
router.post(
  "/resetPassword/:resetToken",
  asyncHandler(userControllers.resetPassword)
);
// Verify email
router.get("/verify/:token", asyncHandler(userControllers.verifyEmail));

router
  .route("/:id")
  .get(isLogin, asyncHandler(userControllers.getUserInfo)) // Get user information
  .put(isLogin, validateUser, asyncHandler(userControllers.updateUser)); // Update user information

module.exports = router;
