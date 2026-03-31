import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/helpers";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaHistory, FaShoppingBag, FaEye, FaTimes, FaSync } from "react-icons/fa";
import Loading from "../components/common/Loading";
import Toast from "../components/common/Toast";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateCartItem, loading } = useCart();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshingStock, setRefreshingStock] = useState(false);

  const fetchProductDetails = useCallback(async () => {
    try {
      const productIds = cartItems.map(item => item.productId);
      const response = await axios.get("/api/products", {
        params: { ids: productIds.join(",") }
      });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems, fetchProductDetails]);

  const handleQuantityChange = async (productId, newQuantity) => {
    const product = products.find(p => p._id === productId);
    if (newQuantity > (product?.stock || 0)) {
      setToast({ message: "❌ Not enough stock available", type: "error" });
      return;
    }
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    setToast({ message: "❌ Item removed from cart", type: "success" });
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const refreshStock = async () => {
    if (!selectedProduct) return;
    setRefreshingStock(true);
    try {
      const response = await axios.get(`/api/products/${selectedProduct._id}`);
      if (response.data.success) {
        setSelectedProduct(response.data.data);
        // Also update in products array
        setProducts(prev => prev.map(p => p._id === selectedProduct._id ? response.data.data : p));
      }
    } catch (err) {
      console.error("Error refreshing stock:", err);
    } finally {
      setRefreshingStock(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p._id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { items: cartItems, total: calculateTotal() } });
  };

  if (loading && cartItems.length === 0) return <Loading />;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-32 pb-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-premium p-12 text-center animate-slide-up">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <FaShoppingBag className="text-4xl text-gray-200" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4 font-outfit">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Looks like you haven't added any fresh catch to your cart yet. Explore our latest findings!
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-aqua-primary-500/20 flex items-center justify-center space-x-2 group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span>Start Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  const subtotal = calculateTotal();
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = (subtotal + shipping) * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-sm">Review Your Selection</span>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2 font-outfit">Shopping Cart</h1>
          <p className="text-gray-500 mt-2">You have <span className="text-aqua-primary-500 font-bold">{cartItems.length}</span> items waiting for checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => {
              const product = products.find(p => p._id === item.productId);
              return (
                <div key={item.productId} className="group bg-white rounded-[2.5rem] shadow-sm hover:shadow-premium p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-100 transition-all duration-300">
                  {/* Image */}
                  <div className="w-full sm:w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 shrink-0">
                    <img
                      src={product?.image || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=300"}
                      alt={product?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-[10px] text-aqua-primary-500 font-black uppercase tracking-widest">{product?.category}</span>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{product?.name}</h3>
                    <p className="text-2xl font-black text-aqua-ocean mb-2">
                      {formatCurrency(product?.price || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock: <span className={`font-medium ${product?.stock > 10 ? 'text-green-600' : product?.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {product?.stock || 0} available
                      </span>
                    </p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-6 shrink-0 w-full sm:w-auto justify-center">
                    <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-2 border border-gray-100">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-6 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-aqua-primary-50 hover:text-aqua-primary-500 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={item.quantity >= (product?.stock || 0)}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    <div className="hidden sm:block w-px h-12 bg-gray-100"></div>

                    <div className="text-right hidden sm:block min-w-[100px]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Subtotal</p>
                      <p className="text-lg font-black text-gray-900">
                        {formatCurrency((product?.price || 0) * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-95"
                      title="Remove Item"
                    >
                      <FaTrash />
                    </button>

                    <button
                      onClick={() => handleViewDetails(product)}
                      className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-aqua-primary-500 hover:bg-aqua-primary-50 rounded-2xl transition-all active:scale-95"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </div>
              );
            })}
            
            <button 
              onClick={() => navigate('/')}
              className="w-full py-6 border-2 border-dashed border-gray-200 rounded-[2.5rem] text-gray-400 font-bold hover:border-aqua-primary-500 hover:text-aqua-primary-500 transition-all flex items-center justify-center space-x-2 group"
            >
              <FaPlus className="text-xs group-hover:rotate-90 transition-transform" />
              <span>Add more items</span>
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[3rem] shadow-premium p-8 border border-gray-100 sticky top-32">
              <h2 className="text-2xl font-black text-gray-900 mb-8 font-outfit">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-gray-900">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span className="font-medium">Estimated Tax (18%)</span>
                  <span className="font-bold text-gray-900">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 mb-10 flex justify-between items-center">
                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">Total</span>
                <span className="text-3xl font-black text-aqua-primary-500">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-aqua-primary-500/20 transition-all transform active:scale-95 uppercase tracking-widest text-xs"
                >
                  Secure Checkout
                </button>

                <button
                  onClick={() => navigate("/orders")}
                  className="w-full bg-gray-50 border border-gray-100 text-gray-600 font-black py-4 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group"
                >
                  <FaHistory className="group-hover:rotate-[-45deg] transition-transform text-gray-400 group-hover:text-aqua-primary-500" />
                  <span>View Order History</span>
                </button>
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-4 grayscale opacity-50">
                 {/* Trust badges placeholders */}
                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
                 <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaTimes />
              </button>

              {/* Zoomed Image */}
              <div className="relative h-80 bg-gray-50 overflow-hidden">
                <img
                  src={selectedProduct.image || "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Product Details */}
              <div className="p-8">
                <div className="mb-6">
                  <span className="text-sm text-aqua-primary-500 font-bold uppercase tracking-widest">{selectedProduct.category}</span>
                  <h2 className="text-3xl font-black text-gray-900 mt-2">{selectedProduct.name}</h2>
                  <p className="text-2xl font-black text-aqua-ocean mt-2">
                    {formatCurrency(selectedProduct.price || 0)}
                  </p>
                </div>

                {/* Real-time Stock Display */}
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">Stock Information</h3>
                    <button
                      onClick={refreshStock}
                      disabled={refreshingStock}
                      className="text-sm text-aqua-primary-500 hover:text-aqua-primary-600 font-medium flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FaSync className={`text-xs ${refreshingStock ? 'animate-spin' : ''}`} />
                      <span>{refreshingStock ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Available Stock:</span>
                    <span className={`text-xl font-black ${
                      selectedProduct.stock > 10 ? 'text-green-600' :
                      selectedProduct.stock > 0 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {selectedProduct.stock || 0} units
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          selectedProduct.stock > 10 ? 'bg-green-500' :
                          selectedProduct.stock > 0 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((selectedProduct.stock / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {selectedProduct.stock > 10 ? 'In Stock' :
                       selectedProduct.stock > 0 ? 'Limited Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      closeModal();
                      navigate(`/products/${selectedProduct._id}`);
                    }}
                    className="flex-1 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-bold py-4 rounded-2xl transition-all"
                  >
                    View Full Details
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-4 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
