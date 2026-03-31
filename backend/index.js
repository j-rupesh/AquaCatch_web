require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// 🔹 Global Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// 🔹 Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 AquaCatch Backend Running Successfully",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 🔹 API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);

// 🔹 404 Route Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// 🔹 Global Error Handler (Must be last)
app.use(errorHandler);

// 🔹 Server Startup

const PORT = process.env.PORT || 5000;

// '0.0.0.0' जोड़ने से यह लोकल नेटवर्क के सभी डिवाइसेस के लिए खुल जाएगा
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 AquaCatch Server is running on:`);
  console.log(`   - Local:   http://localhost:${PORT}`);
  console.log(`   - Network: http://0.0.0:${PORT}`);
  console.log(`🗄️  Environment: ${process.env.NODE_ENV || "development"}`);
});
