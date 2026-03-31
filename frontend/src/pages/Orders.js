import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/common/Loading";
import { formatCurrency, formatDate, getStatusColor } from "../utils/helpers";
import { FaEye, FaHistory, FaBox, FaTimes, FaMapMarkerAlt, FaFileInvoice, FaArrowRight, FaCheckCircle, FaClock, FaTruck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders");
      if (response.data.success) {
        setOrders(response.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="text-center md:text-left">
                <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-sm">Chronological Shipment Analytics</span>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2 font-outfit uppercase italic">Order Ledger</h1>
            </div>
            <div className="flex justify-center md:justify-start">
                <button 
                    onClick={() => navigate("/")}
                    className="group px-8 py-4 bg-white border-2 border-gray-100 rounded-[2rem] text-sm font-bold text-gray-700 hover:border-aqua-primary-500 hover:text-aqua-primary-500 transition-all shadow-sm flex items-center space-x-2"
                >
                    <FaBox className="text-xs group-hover:scale-110 transition-transform" />
                    <span>Back to Shop</span>
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </header>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center md:justify-start">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
              filterStatus === 'all'
                ? 'bg-aqua-primary-500 text-white shadow-lg shadow-aqua-primary-500/20'
                : 'bg-white border border-gray-100 text-gray-600 hover:border-aqua-primary-500 hover:text-aqua-primary-500'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
              filterStatus === 'pending'
                ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20'
                : 'bg-white border border-gray-100 text-gray-600 hover:border-yellow-500 hover:text-yellow-500'
            }`}
          >
            Pending ({orders.filter(o => o.orderStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('shipped')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
              filterStatus === 'shipped'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                : 'bg-white border border-gray-100 text-gray-600 hover:border-blue-500 hover:text-blue-500'
            }`}
          >
            Shipped ({orders.filter(o => o.orderStatus === 'shipped').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
              filterStatus === 'delivered'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'bg-white border border-gray-100 text-gray-600 hover:border-green-500 hover:text-green-500'
            }`}
          >
            Delivered ({orders.filter(o => o.orderStatus === 'delivered').length})
          </button>
        </div>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {orders
              .filter(order => filterStatus === 'all' || order.orderStatus === filterStatus)
              .map((order) => (
              <div
                key={order._id}
                className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-premium hover:shadow-aqua-glow transition-all duration-500 p-6 overflow-hidden"
              >
                {/* Visual Flair */}
                <div className="absolute top-0 right-0 w-40 h-40 -mr-20 -mt-20 bg-aqua-primary-50/50 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                <div className="relative z-10">
                  {/* Header with ID and Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <FaBox className="text-lg" />
                      </div>
                      <div>
                        <p className="font-mono text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border">
                          #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      {order.orderStatus === 'delivered' && <FaCheckCircle className="text-green-500 text-sm" />}
                      {order.orderStatus === 'pending' && <FaClock className="text-yellow-500 text-sm animate-spin-slow" />}
                      {order.orderStatus === 'shipped' && <FaTruck className="text-blue-500 text-sm" />}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <FaMapMarkerAlt className="text-aqua-primary-500 text-sm" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery Location</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {order.shippingAddress?.city}, {order.shippingAddress?.state}
                    </p>
                    <p className="text-xs text-gray-500">{order.shippingAddress?.street}</p>
                  </div>

                  {/* Items Count and Total */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</span>
                      <p className="text-lg font-black text-gray-900">{order.items.length}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</span>
                      <p className="text-2xl font-black text-aqua-primary-500 font-outfit">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                      {order.paymentStatus === 'completed' ? 'Payment Done' : 'Payment Pending'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-aqua-primary-500/20 transition-all transform active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                      <FaEye className="text-sm" />
                      <span>View</span>
                    </button>

                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={async () => {
                          if (window.confirm("Cancel this order?")) {
                            try {
                              await axios.put(`/api/orders/${order._id}/status`, { orderStatus: "cancelled" });
                              fetchOrders();
                            } catch (err) {
                              alert("Failed to cancel order");
                            }
                          }
                        }}
                        className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                        title="Cancel Order"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-32 text-center bg-white rounded-[4rem] border-2 border-dashed border-gray-100 animate-slide-up">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <FaHistory className="text-6xl text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 font-outfit">Historical Vault Empty</h2>
            <p className="text-gray-500 mb-10 text-sm uppercase tracking-widest">No assets have been logged in your decentralized ledger yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-bold py-5 px-12 rounded-2xl transition-all shadow-xl shadow-aqua-primary-500/20"
            >
              Initialize Resource Acquisition
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-aqua-dark/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 z-[200] animate-fade-in">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-100 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            <div className="p-8 sm:p-12 relative overflow-y-auto custom-scrollbar">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all active:rotate-90"
                >
                    <FaTimes />
                </button>

                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-aqua-primary-500 text-white rounded-lg flex items-center justify-center text-2xl shadow-xl">
                      <FaFileInvoice />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase font-outfit leading-none">Protocol Details</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Manifest Hash: #{selectedOrder._id}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                    <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Date</h4>
                        <p className="text-lg font-bold text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Shipment Status</h4>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block ${getStatusColor(selectedOrder.orderStatus)}`}>
                            {selectedOrder.orderStatus}
                        </span>
                    </div>
                    <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Payment Status</h4>
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block ${selectedOrder.paymentStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                            {selectedOrder.paymentStatus}
                        </span>
                    </div>
                    <div className="p-6 bg-[#f8fafc] rounded-3xl border border-gray-100">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Delivery Location</h4>
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-aqua-primary-500" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                            <p className="text-xs text-gray-500">{selectedOrder.shippingAddress?.street}</p>
                          </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shipping Address</h4>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                      <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-aqua-primary-500 mt-1" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                          <p className="text-sm text-gray-700">{selectedOrder.shippingAddress?.street}</p>
                          <p className="text-sm text-gray-700">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.postalCode}</p>
                          <p className="text-sm text-gray-700">{selectedOrder.shippingAddress?.country}</p>
                          <p className="text-sm text-gray-700 mt-2">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>
                </div>

                <div className="space-y-4 mb-12">
                    <div className="flex items-center justify-between px-2">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Manifest</h4>
                      <span className="text-[10px] font-black text-aqua-primary-500 uppercase">{selectedOrder.items.length} Items Listed</span>
                    </div>
                    <div className="space-y-3">
                        {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 hover:bg-white p-5 rounded-3xl border border-transparent hover:border-gray-100 transition-all group/item">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900 uppercase tracking-tighter group-hover/item:text-aqua-primary-600 transition-colors">
                                    {item.productName}
                                </span>
                                <span className="text-[10px] font-black text-gray-400 uppercase">{item.quantity} Units Established</span>
                            </div>
                            <span className="text-lg font-black text-gray-900 font-outfit">{formatCurrency(item.subtotal)}</span>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900 rounded-[2.5rem] p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-center text-white gap-6">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Aggregate Valuation</p>
                        <p className="text-4xl font-black tracking-tighter font-outfit text-aqua-primary-400">{formatCurrency(selectedOrder.totalAmount)}</p>
                        {selectedOrder.trackingNumber && (
                          <p className="text-xs text-gray-400 mt-2">Tracking: {selectedOrder.trackingNumber}</p>
                        )}
                    </div>
                    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-3">
                        <div className="w-8 h-8 bg-aqua-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                           <FaMapMarkerAlt />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[.2rem]">Delivery Confirmed ✓</span>
                    </div>
                </div>
                
                <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full mt-10 py-6 bg-gray-50 border border-gray-100 text-gray-500 font-black rounded-3xl hover:bg-gray-100 transition-all text-xs uppercase tracking-widest flex items-center justify-center space-x-2"
                >
                    <span>Close Ledger View</span>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
