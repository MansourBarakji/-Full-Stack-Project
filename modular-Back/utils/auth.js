const bcrypt = require('bcrypt');

const authenticateUser = async (enteredPassword, realPassword) => {
  return await bcrypt.compare(enteredPassword, realPassword);
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const authUtils = {
  authenticateUser,
  hashPassword,
};

module.exports = authUtils;
