const express = require("express");
const { body } = require("express-validator");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} = require("../controllers/authController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const validateRequest = require("../middleware/validation");
const router = express.Router();

/**
 * Authentication routes
 */
router.post(
  "/register",
  [
    body("name").notEmpty().trim(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validateRequest,
  login
);

/**
 * Protected user routes
 */
router.get("/profile", authenticateToken, getProfile);
router.put("/profile", authenticateToken, updateProfile);
router.put("/change-password", authenticateToken, changePassword);

/**
 * Admin only routes
 */
router.get("/admin/users", authenticateToken, authorizeAdmin, getAllUsers);

module.exports = router;
