const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ExpressError = require("../utils/express_error");
const authUtils  = require("../middleware/auth.js");
const {sendResetPasswordEmail ,sendVerificationEmail} = require("../nodemailer")
const crypto = require('crypto');


const createUser = async(userInfo)=>{
    const { fullName, password, email } = userInfo;
    const userExisted = await User.findOne({ email });
  if (userExisted) {
    throw new ExpressError("User already exists", 400);
  }
  
  const user = await User.create({
    fullName,
    email,
    password:await authUtils.hashPassword(password),
  });
if(!user){
    throw new ExpressError("Invalid User Data", 400);
}
  const verificationToken =  crypto.randomBytes(32).toString('hex');
  const verificationTokenExpiration = Date.now() + 3600000;
  sendVerificationEmail(user.email, verificationToken);
  user.verificationToken = verificationToken;
  user.verificationTokenExpiration =verificationTokenExpiration;
  await user.save();
  return user
}

const authenticateUser = async(userInfo)=>{
    const { password, email } = userInfo;
    const user = await User.findOne({email});
    if (!user) {
        throw new ExpressError("User not found", 404);
    }
    const authenticated =  await authUtils.authenticateUser(
      password,
      user.password
    )
    if (!authenticated) {
        throw new ExpressError("Wrong email or password", 404);
    }
    return user;
}

const generateUserToken = (userID) => {
    return jwt.sign({ userID }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  };

 const sendResetPassEmail = async(email)=>{
    const user = await User.findOne({ email });
    if (!user) {
        throw new ExpressError("User not found", 404);
    }
  
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    sendResetPasswordEmail(user.email , resetToken)
  
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry; 
    await user.save();
  return user;
 } 

 const resetPassword = async(info)=>{
    const { resetToken,newPassword } = info;
   
    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() }, 
    });
  
    if (!user) {
        throw new ExpressError("IInvalid or expired reset token", 400);
    }
  
    user.password =await authUtils.hashPassword(newPassword);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    return user
 };

 const verifyEmail = async(token)=>{
    const user = await User.findOne({ 
        verificationToken: token,
        verificationTokenExpiration:{ $gt: Date.now() }
        });
      if (!user) {
        throw new ExpressError("IInvalid or expired reset token", 400);
      }
    
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpiration = null;
      await user.save();
    return user
 }

 const updateUser = async(userInfo)=>{
    const {userId , fullName , email }= userInfo
    const user = await User.findById(userId)
    if(!user){
      throw new ExpressError("User not found", 404);
      }
    
    user.fullName = fullName; 
    user.email = email;
    await user.save();
    return user;
  
 }
const userService = {
    generateUserToken,
    createUser,
    authenticateUser,
    sendResetPassEmail,
    resetPassword,
    verifyEmail,
    updateUser
  };
  
  module.exports = userService;