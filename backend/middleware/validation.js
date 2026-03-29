const { validationResult } = require("express-validator");

/**
 * Input Validation Middleware
 * Checks for validation errors and returns formatted response
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validateRequest;
