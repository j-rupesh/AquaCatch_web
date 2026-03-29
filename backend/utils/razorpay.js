const Razorpay = require("razorpay");

/**
 * Initialize Razorpay Instance
 * Creates a Razorpay instance with API credentials from environment
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
