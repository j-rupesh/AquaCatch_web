import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "../components/products/ProductCard";
import Loading from "../components/common/Loading";
import Toast from "../components/common/Toast";
import { useCart } from "../context/CartContext";
import { FaFish, FaFilter, FaSearch, FaTimes, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Products() {
  const navigate = useNavigate();
  const { addToCart, totalQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ category: "", search: "", priceRange: "" });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        params.minPrice = min;
        params.maxPrice = max;
      }

      const response = await axios.get("/api/products", { params });
      if (response.data.success) {
        setProducts(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/products/categories");
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      setToast({
        message: "✅ Product added to cart!",
        type: "success",
      });
    } catch (err) {
      setToast({
        message: "❌ Failed to add to cart. Please login first.",
        type: "error",
      });
      navigate("/login");
    }
  };

  const handleViewDetails = (productId) => {
    navigate(`/products/${productId}`);
  };

  const clearFilters = () => {
    setFilters({ category: "", search: "", priceRange: "" });
    setPage(1);
  };

  if (loading && products.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-20">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-gray-900">Shop Fresh Catch</h1>
            <p className="text-gray-500 mt-2">Discover premium seafood delivered fresh</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <FaFilter className="text-gray-500" />
              <span className="text-sm font-medium">Filters</span>
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="relative flex items-center space-x-2 px-4 py-2 bg-aqua-primary-500 text-white rounded-2xl shadow-lg hover:bg-aqua-primary-600 transition-all"
            >
              <FaShoppingCart />
              <span className="text-sm font-medium">Cart</span>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for fresh fish, crabs, plants..."
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:border-aqua-primary-500 focus:ring-2 focus:ring-aqua-primary-500/20 outline-none transition-all text-gray-700 font-medium"
          />
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilters({ ...filters, category: "" })}
              className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                filters.category === ""
                  ? "bg-aqua-primary-500 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-aqua-primary-300 hover:bg-aqua-primary-50"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilters({ ...filters, category })}
                className={`px-6 py-3 rounded-2xl font-medium transition-all ${
                  filters.category === category
                    ? "bg-aqua-primary-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-aqua-primary-300 hover:bg-aqua-primary-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-aqua-primary-500 focus:ring-2 focus:ring-aqua-primary-500/20 outline-none"
                >
                  <option value="">All Prices</option>
                  <option value="0-100">Under ₹100</option>
                  <option value="100-500">₹100 - ₹500</option>
                  <option value="500-1000">₹500 - ₹1000</option>
                  <option value="1000-999999">Above ₹1000</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-3xl mb-8">
            <p className="font-black text-xl mb-1">Oops! Something went wrong</p>
            <p>{error}</p>
          </div>
        )}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : !loading && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <FaFish className="text-6xl text-gray-200 mx-auto mb-6" />
            <p className="text-2xl font-bold text-gray-400 mb-4">No products found</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-aqua-primary-500 text-white rounded-2xl font-bold hover:bg-aqua-primary-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;