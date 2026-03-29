const express = require("express");
const { body } = require("express-validator");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getCategories,
} = require("../controllers/productController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const validateRequest = require("../middleware/validation");
const router = express.Router();

/**
 * Public routes
 */
router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

/**
 * Product reviews
 */
router.post(
  "/:id/reviews",
  authenticateToken,
  [body("rating").isInt({ min: 1, max: 5 })],
  validateRequest,
  addReview
);

/**
 * Admin only routes
 */
router.post(
  "/",
  authenticateToken,
  authorizeAdmin,
  [
    body("name").notEmpty().trim(),
    body("price").isFloat({ min: 0 }),
    body("stock").isInt({ min: 0 }),
  ],
  validateRequest,
  createProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteProduct
);

module.exports = router;
