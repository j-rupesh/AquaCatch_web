import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaShoppingCart, FaCalendarAlt, FaUserAlt, FaCheck, FaTruck, 
  FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaBoxes, FaCreditCard, 
  FaUserShield, FaChevronRight, FaPhoneAlt, FaList, FaTh, FaFilter 
} from "react-icons/fa";
import Loading from "../../components/common/Loading";
import Toast from "../../components/common/Toast";
import { formatCurrency, formatDate, getStatusColor } from "../../utils/helpers";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // New State for View Mode & Filters
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders/admin/all");
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setToast({ message: "❌ Failed to load orders", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let newStatus = "";
    if (currentStatus === "pending") newStatus = "confirmed";
    else if (currentStatus === "confirmed") newStatus = "processing";
    else if (currentStatus === "processing") newStatus = "shipped";
    else if (currentStatus === "shipped") newStatus = "delivered";
    else return;

    try {
      setLoading(true);
      const response = await axios.put(`/api/orders/${orderId}/status`, { orderStatus: newStatus });
      if (response.data.success) {
        setToast({ message: `✅ Order status updated to ${newStatus}`, type: "success" });
        fetchOrders();
      }
    } catch (err) {
      setToast({ message: "❌ Update failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending": 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold tracking-wide"><FaClock className="animate-pulse" /> Pending</span>;
      case "confirmed": 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold tracking-wide"><FaCheck /> Confirmed</span>;
      case "processing": 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold tracking-wide"><FaBoxes /> Processing</span>;
      case "shipped": 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold tracking-wide"><FaTruck /> Shipped</span>;
      case "delivered": 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold tracking-wide"><FaCheck /> Delivered</span>;
      default: 
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-700 border border-gray-200 text-xs font-semibold tracking-wide"><FaBoxes /> {status}</span>;
    }
  };

  // Filtered Orders Logic
  const filteredOrders = orders.filter(order => {
    if (filterStatus === "all") return true;
    return order.orderStatus === filterStatus;
  });

  if (loading && orders.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-blue-600 font-semibold tracking-wider text-xs uppercase mb-1 block">
              Omni-Channel Logistics
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Fulfillment Ledger
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Real-time Pipeline & Asset Tracking
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                Arrival Protocol
              </p>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Incoming Orders</h4>
            <p className="text-3xl font-bold text-gray-900">{orders.filter(o => o.orderStatus === 'pending').length}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Mobile Nodes
              </p>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">In Transit</h4>
            <p className="text-3xl font-bold text-blue-600">{orders.filter(o => o.orderStatus === 'shipped').length}</p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4">
                Global Liquidity
              </p>
              <h4 className="text-sm font-medium text-slate-300 mb-1">Total Value</h4>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0))}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Fulfillment Node
              </p>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Delivered</h4>
            <p className="text-3xl font-bold text-emerald-600">{orders.filter(o => o.orderStatus === 'delivered').length}</p>
          </div>
        </div>

        {/* Controls, Filters & Toggles */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
            <FaFilter className="text-gray-400 mr-2 shrink-0" />
            {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shrink-0 w-full md:w-auto justify-center">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="List View"
            >
              <FaList /> <span className="md:hidden">List</span>
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-semibold ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              title="Grid View"
            >
              <FaTh /> <span className="md:hidden">Grid</span>
            </button>
          </div>
        </div>

        {/* Order Cards Container */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-6"}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              
              viewMode === 'list' ? (
                /* --- LIST VIEW (Detailed Horizontal Card) --- */
                <div key={order._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
                  {/* List Card Header */}
                  <div className="bg-gray-50/80 border-b border-gray-200 p-5 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 shadow-sm">
                        <FaShoppingCart className="text-xl" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </span>
                          {getStatusBadge(order.orderStatus)}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <FaCalendarAlt className="text-gray-400" />
                          {formatDate(order.createdAt)}
                        </div>
                      </div>
                    </div>

                    {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, order.orderStatus)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-colors active:scale-95 w-full sm:w-auto"
                      >
                        Process Phase <FaChevronRight className="text-xs" />
                      </button>
                    )}
                  </div>

                  {/* List Card Body */}
                  <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {/* Client Info */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Client Identity</h5>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FaUserAlt />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{order.userId?.name || order.shippingAddress?.name || "Anonymous Asset"}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{order.userId?.email || order.shippingAddress?.email}</p>
                          {order.shippingAddress?.phone && (
                            <div className="mt-1">
                              {/* Clickable phone link */}
                              <a href={`tel:${order.shippingAddress.phone}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors bg-blue-50 px-2.5 py-1 rounded-md">
                                <FaPhoneAlt className="text-[10px]" /> {order.shippingAddress.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Geo-Tag Signature</h5>
                      <div className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed">
                        <FaMapMarkerAlt className="text-red-500 mt-1 shrink-0 text-base" />
                        <div>
                          <p>{order.shippingAddress?.street}</p>
                          <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                          <p className="font-medium text-gray-800">{order.shippingAddress?.postalCode}</p>
                          
                          {order.shippingAddress?.latitude && (
                            <a 
                              href={`https://www.google.com/maps?q=$${order.shippingAddress.latitude},${order.shippingAddress.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg"
                            >
                              Verify Location <FaExternalLinkAlt className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Valuation & Payment */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Aggregate Valuation</h5>
                      <div>
                        <p className="text-3xl font-bold text-gray-900 tracking-tight">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <div className="mt-4 flex flex-col items-start gap-2">
                          <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${order.paymentStatus === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            <FaCreditCard className="text-sm" />
                            {order.paymentStatus}
                          </div>
                          <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                            Method: <strong className="text-gray-700">{order.paymentMethod === 'razorpay' ? 'Virtual Node' : 'Physical Terminal (COD)'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items Manifest */}
                  <div className="bg-gray-50/50 p-5 sm:p-8 border-t border-gray-200">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Item Manifest</h5>
                    <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 custom-scrollbar">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200 shadow-sm shrink-0 min-w-[280px] hover:border-blue-300 transition-colors">
                          <div className="w-16 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                            <img 
                              src={item.productId?.image || "https://images.unsplash.com/photo-1520239032586-70e0a44e9bb2?auto=format&fit=crop&q=80&w=150"} 
                              alt="" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate" title={item.productName || item.productId?.name}>
                              {item.productName || item.productId?.name}
                            </p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Qty: {item.quantity}</span>
                              <span className="text-sm font-bold text-blue-600">{formatCurrency(item.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (

                /* --- GRID VIEW (Compact Card) --- */
                <div key={order._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-start bg-gray-50/80 rounded-t-2xl">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">ID: #{order._id.slice(-8).toUpperCase()}</span>
                      <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5"><FaCalendarAlt className="text-gray-400" /> {formatDate(order.createdAt).split(',')[0]}</span>
                    </div>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  
                  <div className="p-5 flex-1 space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FaUserAlt className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{order.userId?.name || order.shippingAddress?.name || "Anonymous"}</p>
                        {order.shippingAddress?.phone && (
                           /* Clickable phone link in Grid View too */
                           <a href={`tel:${order.shippingAddress.phone}`} className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors bg-blue-50 px-2 py-0.5 rounded">
                             <FaPhoneAlt className="text-[10px]" /> {order.shippingAddress.phone}
                           </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex justify-between items-center">
                       <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Value</p>
                         <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Items</p>
                         <p className="text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-2 py-1 rounded-md">{order.items?.length || 0} Units</p>
                       </div>
                    </div>
                  </div>

                  {order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && (
                    <div className="p-4 pt-0 mt-auto">
                      <button
                        onClick={() => handleUpdateStatus(order._id, order.orderStatus)}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-colors active:scale-95 flex justify-center items-center gap-2"
                      >
                        Process Phase <FaChevronRight className="text-xs" />
                      </button>
                    </div>
                  )}
                </div>
              )
            ))
          ) : (
            /* Empty State */
            <div className={`col-span-full py-24 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200 ${viewMode === 'grid' ? 'mt-4' : ''}`}>
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaShoppingCart className="text-4xl text-gray-300" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h2>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                {filterStatus === 'all' 
                  ? "No active pipelines detected in your theater right now." 
                  : `No orders found with the status '${filterStatus}'.`}
              </p>
              {filterStatus !== 'all' && (
                <button onClick={() => setFilterStatus('all')} className="mt-4 text-sm font-semibold text-blue-600 hover:underline">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;