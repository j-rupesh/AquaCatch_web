# AquaCatch Backend API

A professional, production-ready eCommerce backend for fish delivery built with Node.js, Express.js, and MongoDB.

## Features

✅ **User Authentication** - JWT-based login and registration
✅ **Product Management** - Full CRUD operations for products
✅ **Shopping Cart** - Add, update, remove items
✅ **Order Management** - Create, track, and manage orders
✅ **Payment Integration** - Razorpay payment gateway
✅ **Admin Panel** - Manage products, users, and orders
✅ **Error Handling** - Comprehensive error handling middleware
✅ **Input Validation** - Request validation with express-validator
✅ **Security** - Password hashing with bcrypt, JWT authentication

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Payments**: Razorpay API
- **Input Validation**: express-validator
- **Environment**: dotenv

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment (.env)
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start Development Server
```bash
npm run dev
```

Server runs at `http://localhost:5000`

## API Documentation

See detailed API docs in the [API_DOCS.md](./API_DOCS.md) file for complete endpoint reference.

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));
🐟 STEP 7: Product Model

👉 Folder banao:

mkdir models

👉 models/Product.js:

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number
});

module.exports = mongoose.model("Product", productSchema);
🔗 STEP 8: API Routes

👉 Folder:

mkdir routes

👉 routes/productRoutes.js:

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET products
router.get("/", async (req, res) => {
  const data = await Product.find();
  res.json(data);
});

// ADD product
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

module.exports = router;
🔌 STEP 9: Routes Connect

👉 server.js me add karo:

app.use("/api/products", require("./routes/productRoutes"));
🧪 STEP 10: Test API

👉 Browser me open karo:

http://localhost:5000/api/products

✔ Empty array dikhega (normal)

PS C:\Users\LENOVO\Downloads\AquaCatch_web> cd aquacatch
PS C:\Users\LENOVO\Downloads\AquaCatch_web\aquacatch> cd backend
PS C:\Users\LENOVO\Downloads\AquaCatch_web\aquacatch\backend> npx nodemon server.js
[nodemon] 3.1.14
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node server.js`
🌐 AquaCatch Server is running on http://localhost:5000
🗄️ Environment: development
✅ MongoDB Connected Successfully

