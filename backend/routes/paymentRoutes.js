const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
  getPaymentStatus,
  processRefund,
} = require("../controllers/paymentController");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * Payment routes
 */
router.post("/create-order", authenticateToken, createRazorpayOrder);
router.post("/verify", authenticateToken, verifyPayment);
router.get("/status/:orderId", authenticateToken, getPaymentStatus);
router.post("/refund/:orderId", authenticateToken, processRefund);

module.exports = router;
