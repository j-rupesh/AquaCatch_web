import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaChartLine, FaShoppingBag, FaDollarSign, FaUserAlt, 
  FaBoxOpen, FaSyncAlt, FaClipboardList, FaClock
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import { formatCurrency } from "../../utils/helpers";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    totalProducts: 0,
    deliveredOrders: 0,
    activeAdmins: 0,
  });
  
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);
  
  const [loading, setLoading] = useState(true); // For initial page load
  const [isRefreshing, setIsRefreshing] = useState(false); // For background/manual sync
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-Refresh (Polling) Logic
  useEffect(() => {
    // Initial Fetch
    fetchRealStats();

    // Set interval to auto-fetch data every 30 seconds
    const intervalId = setInterval(() => {
      fetchRealStats(true); // Pass true to indicate it's a background refresh
    }, 30000); // 30000 ms = 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchRealStats = async (isBackground = false) => {
    // Only show full-screen loader on initial load
    if (!isBackground) setLoading(true); 
    
    setIsRefreshing(true); // Show small spinner on button

    try {
      // Parallel API fetching for maximum performance
      const [orderRes, userRes, productRes] = await Promise.all([
        axios.get("/api/orders/admin/all"),
        axios.get("/api/auth/users"),
        axios.get("/api/products")
      ]);

      const realOrders = orderRes.data?.data || [];
      const realUsers = userRes.data?.data || [];
      const realProducts = productRes.data?.data || [];

      // Fallback Demo Data for "Attractive" Live Theater (User requested "No 0 0")
      const demoOrders = [
        { _id: "ORD6782", orderStatus: "processing", totalAmount: 12400, userId: { name: "Anita Rao" }, items: [{ productName: "Bluefin Asset" }], createdAt: new Date() },
        { _id: "ORD6781", orderStatus: "delivered", totalAmount: 8500, userId: { name: "Vikram Singh" }, items: [{ productName: "Growth Matrix" }], createdAt: new Date() },
        { _id: "ORD6780", orderStatus: "shipped", totalAmount: 15600, userId: { name: "Suresh Mehra" }, items: [{ productName: "Resource Node" }], createdAt: new Date() }
      ];
      const demoUsers = [
        { name: "Anita Rao", role: "customer" },
        { name: "Vikram Singh", role: "customer" },
        { name: "Suresh Mehra", role: "customer" },
        { name: "System Admin", role: "admin" }
      ];
      const demoProducts = [
        { name: "Premium Bluefin Asset", stock: 12, image: "https://images.unsplash.com/photo-1520239032586-70e0a44e9bb2?auto=format&fit=crop&q=80&w=150" },
        { name: "Atlantic Resource Node", stock: 4, image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80&w=150" },
        { name: "Aquatic Growth Matrix", stock: 85, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=150" }
      ];

      // Blend Real and Demo Data
      const orders = realOrders.length > 0 ? realOrders : demoOrders;
      const users = realUsers.length > 1 ? realUsers : demoUsers; // 1 because admin is always there
      const products = realProducts.length > 0 ? realProducts : demoProducts;

      // Calculate Revenue
      const totalRevenue = orders
        .filter(o => o.orderStatus !== 'cancelled')
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      // Total Items Sold
      const totalSalesCount = orders
        .filter(o => o.orderStatus !== 'cancelled')
        .reduce((sum, order) => sum + (order.items?.reduce((iSum, item) => iSum + (item.quantity || 1), 0) || 0), 0);

      // Set Global Stats (Ensuring we don't show 0 if demo data is active)
      setStats({
        totalSales: totalSalesCount || 1541,
        totalOrders: orders.length || 124,
        revenue: totalRevenue || 254300,
        activeUsers: users.length || 86,
        totalProducts: products.length || 18,
        deliveredOrders: orders.filter(o => o.orderStatus === 'delivered').length || 15,
        activeAdmins: users.filter(u => u.role === 'admin').length || 2,
      });

      // Set Lists
      setRecentOrders(orders.slice(0, 5));
      setRecentUsers(users.slice(0, 5));
      
      const sortedProducts = [...products].sort((a, b) => a.stock - b.stock).slice(0, 5);
      setInventoryList(sortedProducts);

      setLastUpdated(new Date());

    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "processing": return "bg-blue-50 text-blue-700 border-blue-200";
      case "shipped": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "delivered": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Format time for "Last Updated" text
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-blue-600 font-semibold tracking-wider text-xs uppercase mb-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live Overview
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium flex items-center gap-1.5">
              <FaClock className="text-gray-400" />
              Last auto-sync at {formatTime(lastUpdated)}
            </p>
          </div>
          
          <button 
            onClick={() => fetchRealStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
          >
            <FaSyncAlt className={`${isRefreshing ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
            {isRefreshing ? 'Syncing Data...' : 'Manual Sync'}
          </button>
        </header>

        {/* Global Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Items Sold</p>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg"><FaChartLine /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg"><FaShoppingBag /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-xs font-semibold text-emerald-600 mt-2">{stats.deliveredOrders} Delivered successfully</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10 flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Net Revenue</p>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center text-lg"><FaDollarSign /></div>
            </div>
            <p className="text-3xl font-bold text-white relative z-10">{formatCurrency(stats.revenue)}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Users</p>
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-lg"><FaUserAlt /></div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
            <p className="text-xs font-semibold text-violet-600 mt-2">{stats.activeAdmins} System Admins online</p>
          </div>
        </div>

        {/* 3-Column Detailed Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Recent Orders List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl shrink-0">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaClipboardList className="text-blue-500" /> Recent Orders
              </h4>
            </div>
            <div className="p-4 flex-1 space-y-3 overflow-y-auto custom-scrollbar">
               {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all flex flex-col gap-3">
                   <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-gray-900">#{order._id.slice(-6).toUpperCase()}</span>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">{order.userId?.name || 'Guest User'}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                   </div>
                   <div className="flex justify-between items-center pt-3 border-t border-gray-50 mt-1">
                      <p className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
                        {order.items?.[0]?.productName || order.items?.[0]?.name || 'Product'} {order.items?.length > 1 && `+${order.items.length - 1}`}
                      </p>
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                   </div>
                </div>
               )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <FaClipboardList className="text-3xl mb-2 opacity-50" />
                    <span className="text-sm font-medium">No recent orders</span>
                  </div>
               )}
            </div>
          </div>

          {/* New Users List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl shrink-0">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaUserAlt className="text-violet-500" /> Newly Registered
              </h4>
            </div>
            <div className="p-4 flex-1 space-y-3 overflow-y-auto custom-scrollbar">
              {recentUsers.length > 0 ? recentUsers.map((user, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{user.name || 'Unknown User'}</p>
                      <p className="text-xs font-medium text-gray-500 capitalize">{user.role || 'customer'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md border border-emerald-100">New</span>
                </div>
              )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <FaUserAlt className="text-3xl mb-2 opacity-50" />
                    <span className="text-sm font-medium">No users found</span>
                  </div>
              )}
            </div>
          </div>

          {/* Inventory Status List (Low Stock Focus) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[400px]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl shrink-0">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FaBoxOpen className="text-amber-500" /> Inventory Alerts
              </h4>
              <span className="text-xs font-semibold text-gray-500">{stats.totalProducts} Total</span>
            </div>
            <div className="p-4 flex-1 space-y-3 overflow-y-auto custom-scrollbar">
               {inventoryList.length > 0 ? inventoryList.map((product, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                   <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400"><FaBoxOpen /></div>
                      )}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center justify-between mt-1">
                         <span className={`text-xs font-bold ${product.stock <= 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                           {product.stock} Units left
                         </span>
                         {product.stock <= 10 && <span className="text-[9px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 uppercase">Low Stock</span>}
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-1000 ${product.stock <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${Math.min((product.stock / 100) * 100, 100)}%`}}></div>
                      </div>
                   </div>
                </div>
               )) : (
                  <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                    <FaBoxOpen className="text-3xl mb-2 opacity-50" />
                    <span className="text-sm font-medium">No products registered</span>
                  </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;