import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSignOutAlt, FaUser as FaUserIcon, FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { totalQuantity } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    ...(isAdmin ? [{ name: "Admin", path: "/admin" }] : []),
    ...(isAuthenticated ? [{ name: "Orders", path: "/orders" }] : []),
  ];

  if (isAdminPath) return null;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-lg shadow-lg py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl filter drop-shadow-md group-hover:rotate-12 transition-transform duration-300">🐟</span>
            <span className={`text-2xl font-black tracking-tighter uppercase italic transition-colors duration-300 ${
              scrolled ? "text-aqua-ocean" : "text-white sm:text-aqua-ocean lg:text-white"
            }`}>
              Aqua<span className="text-aqua-primary-500">Catch</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-aqua-primary-500 text-white shadow-md"
                    : scrolled 
                      ? "text-gray-600 hover:text-aqua-primary-600 hover:bg-aqua-primary-50"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link
                to="/cart"
                className={`relative p-2 transition-colors ${
                  scrolled ? "text-gray-600 hover:text-aqua-primary-500" : "text-white hover:text-aqua-primary-400"
                }`}
              >
                <FaShoppingCart className="text-xl" />
                {totalQuantity > 0 && (
                  <span className="absolute top-0 right-0 bg-fish-orange text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-md">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all ${
                  scrolled 
                    ? "border-gray-200 hover:border-aqua-primary-300 hover:bg-aqua-primary-50" 
                    : "border-white/20 hover:border-white/40 hover:bg-white/10"
                }`}>
                  <div className="w-8 h-8 rounded-full bg-aqua-primary-500 flex items-center justify-center text-white shadow-inner">
                    <FaUserIcon className="text-sm" />
                  </div>
                  <span className={`hidden sm:inline text-sm font-semibold ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}>
                    {user?.name?.split(" ")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-premium border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-aqua-primary-50 hover:text-aqua-primary-600"
                  >
                    My Profile
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-6 py-2.5 rounded-full transition-all duration-300 font-bold shadow-md hover:shadow-cyan-500/20 active:scale-95 text-sm ${
                  scrolled ? "bg-aqua-ocean text-white hover:bg-aqua-primary-600" : "bg-white text-aqua-dark hover:bg-aqua-primary-400 hover:text-white"
                }`}
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className={`md:hidden p-2 transition-colors ${
                scrolled ? "text-gray-600 hover:text-aqua-primary-500" : "text-white hover:text-aqua-primary-400"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-aqua-dark/50 backdrop-blur-sm z-[90] transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-white z-[100] shadow-2xl transition-transform duration-500 transform md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xl font-bold italic text-aqua-ocean">AquaCatch</span>
            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400">
              <FaTimes />
            </button>
          </div>

          <div className="space-y-4 flex-grow">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all ${
                  location.pathname === link.path
                    ? "bg-aqua-primary-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="mt-auto block w-full bg-aqua-primary-500 text-white text-center py-4 rounded-xl font-bold shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
