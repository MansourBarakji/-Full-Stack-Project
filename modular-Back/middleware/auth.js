const ExpressError = require("../utils/expressError");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userSchema, bookSchema, orderSchema } = require("../setup/joiSchemas");
const { UNAUTHORIZED_PATHS } = require("../constants/unauthorizedPaths");

module.exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  if (UNAUTHORIZED_PATHS.includes(req.path)) {
    return next();
  }

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ExpressError("You must be logged in first", 401);
  }
  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userID);
    if (!user) {
      throw new ExpressError("Unauthorized ", 401);
    }
    req.user = user;

    next();
  } catch (error) {
    throw new ExpressError("Unauthorized ", 401);
  }
});

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports.validateBook = (req, res, next) => {
  const { error } = bookSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports.validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};
