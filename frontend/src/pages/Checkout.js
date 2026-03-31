import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/helpers";
import axios from "axios";
import Toast from "../components/common/Toast";
import Loading from "../components/common/Loading";
import { FaMapMarkerAlt, FaTimes, FaCrosshairs, FaShieldAlt, FaTruck, FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [mapPosition, setMapPosition] = useState([19.076, 72.877]); // Default Mumbai

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.postalCode || "",
    country: user?.address?.country || "India",
    phone: user?.phone || "",
    latitude: null,
    longitude: null,
  });

  const total = location.state?.total || 0;
  const shipping = total > 1000 ? 0 : 50;
  const tax = (total + shipping) * 0.18;
  const grandTotal = total + shipping + tax;

  // Map Click Handler
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMapPosition([lat, lng]);
        reverseGeocode(lat, lng);
      },
    });

    return address.latitude && address.longitude ? (
      <Marker position={[address.latitude, address.longitude]} />
    ) : null;
  }

  const reverseGeocode = async (lat, lng) => {
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await resp.json();
      if (data && data.address) {
        const addr = data.address;
        setAddress({
          ...address,
          street: addr.road || addr.suburb || addr.neighbourhood || "",
          city: addr.city || addr.town || addr.village || "",
          state: addr.state || "",
          postalCode: addr.postcode || "",
          latitude: lat,
          longitude: lng,
        });
      }
    } catch (err) {
      console.error("Geocoding error", err);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!address.latitude || !address.longitude) {
      setToast({ message: "❌ Please select your precise location on the map", type: "error" });
      return;
    }

    if (!address.phone || address.phone.length < 10) {
      setToast({ message: "❌ Valid 10-digit mobile number is mandatory", type: "error" });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/orders", {
        items: cartItems.map(item => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.price * item.quantity
        })),
        shippingAddress: { ...address, name: user.name, email: user.email },
        totalAmount: grandTotal,
        paymentMethod,
      });

      if (response.data.success) {
        const orderId = response.data.data._id;
        setToast({ message: "✅ Order created successfully!", type: "success" });

        if (paymentMethod === "razorpay") {
          await initiatePayment(orderId);
        } else {
          await clearCart();
          setTimeout(() => navigate("/orders"), 1000);
        }
      }
    } catch (err) {
      setToast({ message: `❌ ${err.response?.data?.message || "Failed to place order"}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (orderId) => {
    try {
      const paymentResponse = await axios.post("/api/payment/create-order", { orderId });
      if (paymentResponse.data.success) {
        const options = {
          key: paymentResponse.data.data.keyId,
          amount: paymentResponse.data.data.amount,
          currency: "INR",
          order_id: paymentResponse.data.data.orderId,
          handler: async (response) => {
            await verifyPayment(orderId, response);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone,
          },
        };

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      setToast({ message: "❌ Payment initiation failed", type: "error" });
    }
  };

  const verifyPayment = async (orderId, response) => {
    try {
      const verifyResponse = await axios.post("/api/payment/verify", {
        orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });

      if (verifyResponse.data.success) {
        await clearCart();
        setToast({ message: "✅ Payment successful! Order placed.", type: "success" });
        setTimeout(() => navigate("/orders"), 1500);
      }
    } catch (err) {
      setToast({ message: "❌ Payment verification failed", type: "error" });
    }
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-sm">Phase 03 — Checkout Lifecycle</span>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2 font-outfit uppercase italic">Secure Fulfillment</h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
               <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                  <FaShieldAlt />
                  <span className="text-xs font-bold uppercase tracking-wider">SSL Encrypted</span>
               </div>
               <div className="flex items-center space-x-2 text-aqua-primary-500 bg-aqua-primary-50 px-4 py-2 rounded-full border border-aqua-primary-100">
                  <FaCreditCard />
                  <span className="text-xs font-bold uppercase tracking-wider">PCI Compliant</span>
               </div>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Map Section */}
            <div className="group bg-white rounded-[3rem] shadow-premium p-4 border border-gray-100 animate-fade-in">
              <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden border-4 border-gray-50 shadow-inner">
                  <MapContainer center={mapPosition} zoom={13} style={{ height: "100%", width: "100%", zIndex: 1 }}>
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker />
                  </MapContainer>
                  
                  {/* Floating instructions */}
                  <div className="absolute top-6 left-6 z-[400] glass p-6 rounded-[2rem] shadow-2xl max-w-xs border border-white group-hover:scale-105 transition-transform duration-500">
                      <div className="w-10 h-10 bg-aqua-primary-500 rounded-full flex items-center justify-center text-white mb-4 animate-bounce">
                         <FaMapMarkerAlt />
                      </div>
                      <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">Set Delivery Point</h4>
                      <p className="text-xs text-gray-500 leading-relaxed uppercase">Tap on the map for laser-precise delivery coordination.</p>
                      {address.latitude && (
                          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-[10px] font-black text-aqua-primary-500">COORDS ESTABLISHED</span>
                            <div className="flex space-x-2">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                          </div>
                      )}
                  </div>
              </div>
            </div>

            {/* Address & Payment Form */}
            <div className="bg-white rounded-[3rem] shadow-premium p-8 sm:p-12 border border-gray-100 animate-slide-up">
              <form onSubmit={handlePlaceOrder} className="space-y-12">
                <section>
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-aqua-primary-500/10 rounded-2xl flex items-center justify-center text-aqua-primary-500 font-black text-xl">1</div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase font-outfit">Delivery Matrix</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {/* Phone - Prominent */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-red-500 uppercase tracking-[.2em] ml-2">Contact Sequence (Mobile) *</label>
                        <div className="relative group">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">+91</span>
                          <input
                            type="tel"
                            required
                            maxLength="10"
                            placeholder="Digit Sequencing"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value.replace(/\D/g, '') })}
                            className="w-full pl-16 pr-6 py-6 bg-red-50/20 border-2 border-transparent focus:border-red-100 focus:bg-white rounded-3xl outline-none transition-all font-black text-xl placeholder:text-gray-200"
                          />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Street Architecture</label>
                            <input
                              type="text"
                              required
                              value={address.street}
                              onChange={(e) => setAddress({ ...address, street: e.target.value })}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all font-bold placeholder:text-gray-300"
                              placeholder="Flat / Building / Area"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Geo-Hub (City)</label>
                            <input
                              type="text"
                              required
                              value={address.city}
                              onChange={(e) => setAddress({ ...address, city: e.target.value })}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Provincial Code</label>
                            <input
                              type="text"
                              required
                              value={address.state}
                              onChange={(e) => setAddress({ ...address, state: e.target.value })}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Zip Sequence</label>
                            <input
                              type="text"
                              required
                              value={address.postalCode}
                              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                              className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-3xl outline-none transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Territory</label>
                            <input
                              type="text"
                              disabled
                              value={address.country}
                              className="w-full px-6 py-5 bg-gray-100 border-2 border-transparent rounded-3xl font-bold opacity-50 cursor-not-allowed uppercase"
                            />
                        </div>
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-aqua-primary-500/10 rounded-2xl flex items-center justify-center text-aqua-primary-500 font-black text-xl">2</div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase font-outfit">Payment Terminal</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className={`group relative flex flex-col items-center justify-center p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all duration-300 ${paymentMethod === 'razorpay' ? 'border-aqua-primary-500 bg-aqua-primary-50/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                          <input type="radio" className="hidden" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${paymentMethod === 'razorpay' ? 'bg-aqua-primary-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                            <FaCreditCard className="text-2xl" />
                          </div>
                          <span className="text-sm font-black uppercase tracking-widest text-gray-900">Virtual Assets</span>
                          <span className="text-[10px] font-bold text-aqua-primary-600 mt-2 uppercase">Instant Authorization</span>
                          {paymentMethod === 'razorpay' && <div className="absolute top-4 right-4 w-4 h-4 bg-aqua-primary-500 rounded-full flex items-center justify-center shadow-lg"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                      </label>

                      <label className={`group relative flex flex-col items-center justify-center p-8 border-2 rounded-[2.5rem] cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-orange-400 bg-orange-50/30' : 'border-gray-50 hover:bg-gray-50'}`}>
                          <input type="radio" className="hidden" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${paymentMethod === 'cod' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                            <FaMoneyBillWave className="text-2xl" />
                          </div>
                          <span className="text-sm font-black uppercase tracking-widest text-gray-900">Physical Asset</span>
                          <span className="text-[10px] font-bold text-orange-600 mt-2 uppercase">Cash on Delivery</span>
                          {paymentMethod === 'cod' && <div className="absolute top-4 right-4 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>}
                      </label>
                  </div>
                </section>

                <button
                  type="submit"
                  className="w-full py-6 bg-aqua-dark text-white font-black rounded-3xl shadow-2xl hover:bg-black transition-all transform active:scale-95 uppercase tracking-[.3em] overflow-hidden group relative text-sm"
                >
                  <span className="relative z-10">Authorize Fulfillment</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-aqua-primary-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-8 animate-slide-in">
            <div className="bg-white rounded-[3rem] shadow-premium p-8 border border-gray-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-aqua-primary-50 rounded-full opacity-30"></div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-8 font-outfit">Asset Valuation</h2>

              <div className="space-y-6 mb-8 border-b border-gray-50 pb-8">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50/50 p-1 border border-gray-100 shrink-0 overflow-hidden">
                      <img src={item.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrQvXjVW_JATGHkXxx_GlADLK5GHSI24MkOp18mpQB1YoEw2Deos92Ob_dF8OsfnrgoNnHd0JwOjxnXm14gCc8sELv1vMx6mseM9whf-SK&s=10"} alt="" className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tighter">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">{item.quantity} Units @ {formatCurrency(item.price)}</p>
                    </div>
                    <p className="text-sm font-black text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-[10px] font-black uppercase tracking-[.2em] text-gray-400 px-2">
                <div className="flex justify-between">
                  <span>Gross Valuation</span>
                  <span className="text-gray-900">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Cost</span>
                  <span className={shipping === 0 ? "text-green-500" : "text-gray-900"}>
                    {shipping === 0 ? "WAVED (FREE)" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Resource Tax (18%)</span>
                  <span className="text-gray-900">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t-4 border-aqua-dark">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aggregate Total</span>
                    <span className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
                        {formatCurrency(grandTotal)}
                    </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-aqua-dark rounded-[2.5rem] shadow-xl p-8 text-white relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full transform group-hover:scale-150 transition-transform duration-1000"></div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-aqua-primary-500 rounded-xl flex items-center justify-center text-white">
                       <FaCrosshairs className="text-xl" />
                    </div>
                    <h4 className="font-black text-sm uppercase tracking-widest">Protocol Secured</h4>
                </div>
                <p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase">
                    Your shipment is tracked via GPS once established. End-to-end data encryption is active during this transaction.
                </p>
                <div className="mt-6 flex items-center space-x-2 text-[10px] font-black text-aqua-primary-400 uppercase tracking-widest">
                   <FaShieldAlt />
                   <span>Protected by AquaGuard Security</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
