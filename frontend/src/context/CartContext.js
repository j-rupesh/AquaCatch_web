import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchCart();
    }
  }, [isAuthenticated, token]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/cart");
      if (response.data.success) {
        setCartItems(response.data.data.items || []);
      }
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/cart/add", {
        productId,
        quantity,
      });

      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add to cart";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put("/api/cart/update", {
        productId,
        quantity,
      });

      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update cart";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`);

      if (response.data.success) {
        setCartItems(response.data.data.items || []);
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove item";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete("/api/cart/clear");

      if (response.data.success) {
        setCartItems([]);
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to clear cart";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchCart,
        getCartTotal,
        itemCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
