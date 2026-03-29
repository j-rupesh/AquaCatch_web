const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * Protected cart routes
 */
router.get("/", authenticateToken, getCart);
router.post("/add", authenticateToken, addToCart);
router.put("/update", authenticateToken, updateCartItem);
router.delete("/remove/:productId", authenticateToken, removeFromCart);
router.delete("/clear", authenticateToken, clearCart);

module.exports = router;
