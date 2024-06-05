const ExpressError = require("../utils/express_error");
const asyncHandler = require("express-async-handler");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


 
module.exports.isLogin = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new ExpressError("Unauthorized no token", 401);
  }
 const token = authorization.split(" ")[1];

try {
  // Verify the token and decode the payload
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // Find the user based on the decoded payload
  const user = await User.findById(decoded.userID);
  if (!user) {
    throw new ExpressError("Unauthorized ", 401);
  }

  // Set the authenticated user in the request object
  req.user = user;
  
  next();
} catch (error) {
  console.log(error)
  throw new ExpressError("Unauthorized ", 401);}
});


module.exports.authenticateUser = async (enteredPassword, realPassword) => {
    return await bcrypt.compare(enteredPassword, realPassword);
  };
  
  module.exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  };
  
  
  