const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user data to request
 */
const authenticateToken = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access token is missing or invalid" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Admin Authorization Middleware
 * Checks if the authenticated user is an admin
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin privileges required" });
  }

  next();
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
};
