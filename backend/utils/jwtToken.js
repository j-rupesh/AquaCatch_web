const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * Creates an access token with user information
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

/**
 * Decode JWT Token
 * Verifies and decodes a token
 */
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  decodeToken,
};
