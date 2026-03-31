const Product = require("../models/Product");

/**
 * Get all products
 * GET /api/products
 */
exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12, sort = "-createdAt", minPrice, maxPrice } = req.query;

    let filter = { isActive: true };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 * GET /api/products/:id
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product (Admin only)
 * POST /api/products
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock, isActive } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isActive = isActive !== undefined ? isActive : product.isActive;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add review to product
 * POST /api/products/:id/reviews
 */
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to add review",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = {
      userId: req.user.userId,
      rating,
      comment,
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = totalRating / product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product categories
 * GET /api/products/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = ["Fresh Fish", "Frozen Fish", "Processed Fish", "Aquatic Plants"];

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
