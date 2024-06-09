const ExpressError = require("../utils/express_error");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userSchema, bookSchema, orderSchema } = require("../joiSchemas/index");

module.exports.isLogin = asyncHandler(async (req, res, next) => {
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
    console.log(error);
    throw new ExpressError("Unauthorized ", 401);
  }
});

module.exports.authenticateUser = async (enteredPassword, realPassword) => {
  return await bcrypt.compare(enteredPassword, realPassword);
};

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

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
