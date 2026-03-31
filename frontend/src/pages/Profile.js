import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import Toast from "../components/common/Toast";
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSave } from "react-icons/fa";

function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      postalCode: user?.address?.postalCode || "",
      country: user?.address?.country || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.replace("address.", "");
      setFormData({
        ...formData,
        address: { ...formData.address, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setToast({ message: "✅ Profile updated successfully!", type: "success" });
    } catch (err) {
      setToast({ message: `❌ ${err.message}`, type: "error" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-poppins text-gray-800">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center sm:text-left">
           <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-sm">Account Preferences</span>
           <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-2 font-outfit uppercase italic">My Profile</h1>
           <p className="text-gray-500 mt-2">Manage your personal information and delivery coordinates</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-1 gap-8 animate-slide-up">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-premium p-8 sm:p-12 border border-blue-50 relative overflow-hidden">
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 bg-aqua-primary-50/50 rounded-full blur-[60px]"></div>

             <div className="relative z-10 space-y-12">
                {/* Personal Section */}
                <section>
                  <div className="flex items-center space-x-6 mb-10">
                     <div className="w-16 h-16 bg-aqua-primary-500 text-white rounded-lg flex items-center justify-center text-2xl shadow-xl">
                        <FaUser />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase font-outfit">Identity Verification</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2 flex items-center gap-2">
                         <FaEnvelope className="text-aqua-primary-500" />
                         Email Address (Read-Only)
                       </label>
                       <input
                         type="email"
                         value={user?.email || ""}
                         disabled
                         className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-lg text-gray-500 font-bold opacity-60 cursor-not-allowed uppercase text-sm"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2 flex items-center gap-2">
                         <FaUser className="text-aqua-primary-500" />
                         Full Name
                       </label>
                       <input
                         type="text"
                         name="name"
                         value={formData.name}
                         onChange={handleChange}
                         required
                         className="w-full px-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-900"
                         placeholder="Authorized Name"
                       />
                    </div>

                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2 flex items-center gap-2">
                         <FaPhone className="text-aqua-primary-500" />
                         Contact Sequence (Mobile)
                       </label>
                       <div className="relative group">
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 border-r border-gray-200 pr-4 font-bold">+91</span>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            className="w-full pl-24 pr-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold text-gray-900"
                            placeholder="10-digit primary number"
                          />
                       </div>
                    </div>
                  </div>
                </section>

                {/* Address Section */}
                <section>
                  <div className="flex items-center space-x-6 mb-10">
                     <div className="w-16 h-16 bg-aqua-midnight text-white rounded-lg flex items-center justify-center text-2xl shadow-xl">
                        <FaMapMarkerAlt />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase font-outfit">Logistical Base (Address)</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Street Architecture</label>
                       <input
                         type="text"
                         name="address.street"
                         value={formData.address.street}
                         onChange={handleChange}
                         className="w-full px-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold"
                         placeholder="Refined street address"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Geo-Hub (City)</label>
                       <input
                         type="text"
                         name="address.city"
                         value={formData.address.city}
                         onChange={handleChange}
                         className="w-full px-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Provincial Code (State)</label>
                       <input
                         type="text"
                         name="address.state"
                         value={formData.address.state}
                         onChange={handleChange}
                         className="w-full px-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Zip Sequence</label>
                       <input
                         type="text"
                         name="address.postalCode"
                         value={formData.address.postalCode}
                         onChange={handleChange}
                         className="w-full px-6 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-200 focus:bg-white rounded-lg outline-none transition-all font-bold"
                       />
                    </div>

                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] ml-2">Territory</label>
                       <input
                         type="text"
                         name="address.country"
                         value={formData.address.country}
                         onChange={handleChange}
                         className="w-full px-6 py-5 bg-gray-100 border-2 border-transparent rounded-lg text-gray-400 font-bold uppercase cursor-not-allowed opacity-60"
                         disabled
                       />
                    </div>
                  </div>
                </section>

                <div className="pt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-black py-6 rounded-lg shadow-xl shadow-aqua-primary-500/20 transition-all transform active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center space-x-3 group"
                  >
                    <FaSave className="text-sm group-hover:scale-110 transition-transform" />
                    <span>{loading ? "Synching Protocol..." : "Finalize Profile Changes"}</span>
                  </button>
                  <button
                    disabled
                    className="px-10 py-6 bg-gray-50 text-gray-300 font-black rounded-lg uppercase tracking-widest text-[10px] cursor-not-allowed"
                  >
                    Reset Defaults
                  </button>
                </div>
             </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
