import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProductCard from "../components/products/ProductCard";
import Loading from "../components/common/Loading";
import Toast from "../components/common/Toast";
import { useCart } from "../context/CartContext";
import { FaFish, FaTruck, FaShieldAlt, FaStar, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ category: "", search: "" });
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;

      const response = await axios.get("/api/products", { params });
      if (response.data.success) {
        // Fallback added to prevent .map() crash if data is undefined
        setProducts(response.data.data || []);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]); // Cleaned up redundant dependencies

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

  if (loading && products.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-aqua-dark">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-aqua-primary-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-slide-up">
              <span className="inline-block px-4 py-2 rounded-full bg-aqua-primary-500/10 border border-aqua-primary-500/20 text-aqua-primary-400 text-sm font-bold tracking-widest uppercase">
                Premium Fish Market
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Fresh Catch <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua-primary-400 to-blue-400">
                  Delivered Today
                </span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the finest quality aquatic products sourced directly from the docks. 
                Sustainably caught, perfectly chilled, and delivered to your doorstep.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/products')}
                  className="px-8 py-4 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-aqua-primary-500/20 flex items-center space-x-2 group"
                >
                  <span>Shop Now</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all backdrop-blur-md">
                  View Offers
                </button>
              </div>
              <div className="flex items-center justify-center lg:justify-start space-x-8 pt-4">
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">5k+</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider">Customers</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider">Varieties</p>
                </div>
                <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                <div className="text-center lg:text-left">
                  <p className="text-3xl font-bold text-white">1hr</p>
                  <p className="text-gray-500 text-sm uppercase tracking-wider">Delivery</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative animate-float group">
               <div className="absolute inset-0 bg-aqua-primary-500/20 rounded-full blur-[80px] scale-75 group-hover:scale-110 transition-transform duration-1000"></div>
               <img 
                 src="https://pet-health-content-media.chewy.com/wp-content/uploads/2025/04/16142244/202504202409pet-fish-betta.jpg" 
                 alt="Fresh Fish" 
                 className="relative z-10 w-full max-w-lg mx-auto rounded-[3rem] shadow-2xl border-8 border-white/5 object-cover transform hover:rotate-2 transition-transform duration-700"
               />
               <div className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl animate-pulse hidden sm:block">
                  <FaFish className="text-4xl text-aqua-primary-400" />
               </div>
               <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-3xl shadow-2xl hidden sm:block">
                  <p className="text-white font-bold text-sm">🚚 Ultra Fast Delivery</p>
               </div>
            </div>
          </div>
        </div>

        {/* Waves bottom decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 opacity-5">
          <svg className="relative block w-full h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
          </svg>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[2.5rem] shadow-premium p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 items-center border border-gray-100">
          <div className="relative flex-1 w-full group">
            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-aqua-primary-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for fresh fish, crabs, plants..."
              value={filters.search}
              onChange={(e) => {
                setFilters({ ...filters, search: e.target.value });
                setPage(1);
              }}
              className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all text-gray-700"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={filters.category}
              onChange={(e) => {
                setFilters({ ...filters, category: e.target.value });
                setPage(1);
              }}
              className="flex-1 md:flex-none px-8 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all text-gray-700 font-semibold min-w-[180px]"
            >
              <option value="">All Categories</option>
              <option value="Fresh Fish">Fresh Fish</option>
              <option value="Frozen Fish">Frozen Fish</option>
              <option value="Processed Fish">Processed Fish</option>
              <option value="Aquatic Plants">Aquatic Plants</option>
            </select>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {[
            { icon: <FaTruck />, title: "Express Delivery", desc: "Arrives at your door within 60 minutes in local areas." },
            { icon: <FaShieldAlt />, title: "Grade A Selection", desc: "Rigorous quality checks for every single piece of fish." },
            { icon: <FaStar />, title: "Premium Sourcing", desc: "Directly from sustainable fishermen and local docks." }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-premium transition-all duration-500 border border-transparent hover:border-aqua-primary-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-aqua-primary-500 text-white flex items-center justify-center text-3xl mb-6 shadow-lg shadow-aqua-primary-500/20 group-hover:rotate-6 transition-transform mx-auto md:mx-0">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="pb-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-sm">Quality Guaranteed</span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2">Latest Sea Findings</h2>
            </div>
            <p className="text-gray-500 max-w-md text-center md:text-right">
              Explore our freshly updated inventory. Caught today, delivered today. No frozen compromises here.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-600 p-6 rounded-3xl mb-12 animate-fade-in">
              <p className="font-black text-xl mb-1">Oops! Something went wrong</p>
              <p>{error}</p>
            </div>
          )}

          {/* Logic Fix: Product Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.map((product) => (
                <div key={product._id} className="animate-fade-in">
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Logic Fix: Empty State - only show when there is NO error and NO products */}
          {!error && products.length === 0 && !loading && (
            <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <FaFish className="text-8xl text-gray-200 mx-auto mb-6" />
              <p className="text-2xl font-bold text-gray-400">No products found matching your search</p>
              <button 
                onClick={() => setFilters({ category: "", search: "" })}
                className="mt-6 text-aqua-primary-500 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-aqua-dark text-white pt-24 pb-12 px-4 rounded-t-[3rem] lg:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2 space-y-8 text-center md:text-left">
              <Link to="/" className="flex items-center justify-center md:justify-start space-x-2">
                <span className="text-4xl">🐟</span>
                <span className="text-3xl font-black italic tracking-tighter uppercase">AquaCatch</span>
              </Link>
              <p className="text-gray-400 text-lg max-w-sm mx-auto md:mx-0">
                Premium seafood delivered with care and speed. Sourcing the best for your healthy lifestyle.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-aqua-primary-500 transition-colors cursor-pointer group">
                    <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white transition-colors"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-xl mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/" className="hover:text-aqua-primary-400 transition">Home</Link></li>
                <li><Link to="/products" className="hover:text-aqua-primary-400 transition">Shop</Link></li>
                <li><Link to="/orders" className="hover:text-aqua-primary-400 transition">My Orders</Link></li>
                <li><Link to="/profile" className="hover:text-aqua-primary-400 transition">Profile</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-bold text-xl mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><button className="hover:text-aqua-primary-400 transition">Help Center</button></li>
                <li><button className="hover:text-aqua-primary-400 transition">Terms of Service</button></li>
                <li><button className="hover:text-aqua-primary-400 transition">Privacy Policy</button></li>
                <li><button className="hover:text-aqua-primary-400 transition">Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} AquaCatch Premium. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;