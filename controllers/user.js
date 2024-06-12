const ExpressError = require("../utils/expressError.js");
const userService = require("../service/userService.js");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const rateLimiter = new RateLimiterMemory({
  points: 3, // Number of allowed requests
  duration: 3600, // 1 hour in seconds
});

module.exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const userInfo = {
    fullName,
    email,
    password,
  };
  const newUser = await userService.createUser(userInfo);

  if (!newUser) {
    throw new ExpressError("User already existed", 400);
  }
  const userToken = userService.generateUserToken(newUser._id);

  res.json({ token: userToken });
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const userInfo = {
    email,
    password,
  };
  const user = await userService.authenticateUser(userInfo);
  if (!user) {
    throw new ExpressError("Wrong email or password", 404);
  }
  const userToken = userService.generateUserToken(user._id);
  res.json({ token: userToken });
};

module.exports.sendResetPasswordEmail = async (req, res) => {
  const { email } = req.body;
  try {
    await rateLimiter.consume(email);
  } catch (rejRes) {
    throw new ExpressError("Rate limit exceeded. Please try again later.", 429);
  }
  const sendResetPass = await userService.sendResetPassEmail(email);
  if (!sendResetPass) {
    throw new ExpressError("User not found", 404);
  }
  res.json({
    message: "Password reset email sent successfully check Your Email",
  });
};

module.exports.resetPassword = async (req, res) => {
  const { newPassword, resetToken } = req.body;
  const info = {
    resetToken,
    newPassword,
  };
  const user = await userService.resetPassword(info);
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  res.status(200).json({ message: "Password reset successful" });
};

module.exports.verifyEmail = async (req, res) => {
  const { token } = req.body;

  const user = await userService.verifyEmail(token);
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  res.status(200).json({ message: "Email verification successful." });
};

module.exports.getUserInfo = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ExpressError("User not found", 404);
  }
  res.json(user);
};

module.exports.updateUser = async (req, res) => {
  const userId = req.user._id;
  const { email, fullName } = req.body;
  const userInfo = { userId, email, fullName };
  const updateUser = await userService.updateUser(userInfo);
  if (!updateUser) {
    throw new ExpressError("User not Updated", 404);
  }
  res.status(200).json({ message: "User updated successful." });
};
