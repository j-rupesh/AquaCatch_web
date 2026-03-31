import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

// Admin Components & Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import Settings from "./pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route
                path="/cart"
                element={<ProtectedRoute element={<Cart />} />}
              />
              <Route
                path="/checkout"
                element={<ProtectedRoute element={<Checkout />} />}
              />
              <Route
                path="/orders"
                element={<ProtectedRoute element={<Orders />} />}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute element={<Profile />} />}
              />

              {/* Admin Routes with Nested Layout */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute
                    element={
                      <AdminLayout>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/products" element={<ProductManagement />} />
                          <Route path="/orders" element={<OrderManagement />} />
                          <Route path="/users" element={<UserManagement />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </AdminLayout>
                    }
                  />
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;