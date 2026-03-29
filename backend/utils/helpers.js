const crypto = require("crypto");

/**
 * Generate random tracking number for orders
 */
const generateTrackingNumber = () => {
  return `ACT-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
};

/**
 * Apply discount to order total
 */
const applyDiscount = (totalAmount, discountPercent) => {
  return (totalAmount * discountPercent) / 100;
};

/**
 * Calculate tax (GST - 18% for India)
 */
const calculateTax = (amount, taxRate = 18) => {
  return (amount * taxRate) / 100;
};

/**
 * Calculate final price with tax and discount
 */
const calculateFinalPrice = (subtotal, discountPercent = 0, shippingCost = 0) => {
  const discount = applyDiscount(subtotal, discountPercent);
  const taxableAmount = subtotal - discount + shippingCost;
  const tax = calculateTax(taxableAmount);
  return {
    subtotal,
    discount,
    tax,
    shippingCost,
    totalAmount: subtotal - discount + shippingCost + tax,
  };
};

/**
 * Verify Razorpay payment signature
 */
const verifyRazorpaySignature = (
  orderId,
  paymentId,
  signature,
  secret
) => {
  const data = orderId + "|" + paymentId;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("hex");
  return generatedSignature === signature;
};

module.exports = {
  generateTrackingNumber,
  applyDiscount,
  calculateTax,
  calculateFinalPrice,
  verifyRazorpaySignature,
};
