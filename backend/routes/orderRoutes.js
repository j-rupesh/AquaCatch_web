const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  cancelOrder,
} = require("../controllers/orderController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const router = express.Router();

/**
 * Protected user routes
 */
router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getUserOrders);
router.get("/:id", authenticateToken, getOrderById);
router.put("/:id/cancel", authenticateToken, cancelOrder);

/**
 * Admin only routes
 */
router.get("/admin/all", authenticateToken, authorizeAdmin, getAllOrders);
router.put("/:id/status", authenticateToken, authorizeAdmin, updateOrderStatus);

module.exports = router;
