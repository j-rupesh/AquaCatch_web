import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/common/Toast";
import Loading from "../components/common/Loading";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaUserPlus } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.name, formData.email, formData.password, formData.phone);
      setToast({ message: "✅ Protocol Accepted: Identity Established!", type: "success" });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setToast({ message: `❌ Access Denied: ${err.message}`, type: "error" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-aqua-dark flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-1/2 -left-24 w-96 h-96 bg-aqua-primary-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-float"></div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="w-full max-w-2xl relative z-10 animate-slide-up">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl p-8 sm:p-12 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

          <header className="text-center mb-10">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <span className="text-4xl filter drop-shadow-md">🐟</span>
              <span className="text-3xl font-black italic tracking-tighter uppercase text-white">Aqua<span className="text-aqua-primary-400">Catch</span></span>
            </Link>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest font-outfit">Identity Protocol</h2>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Establish your decentralized profile</p>
          </header>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaUser className="text-aqua-primary-400" />
                Identity Label (Full Name)
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="AUTHENTIC NAME"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaEnvelope className="text-aqua-primary-400" />
                Auth Identifier (Email)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="USER@DOMAIN.COM"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaPhone className="text-aqua-primary-400" />
                Contact Sequence (Phone)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength="10"
                className="w-full px-6 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="10-DIGIT MOBILE"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaLock className="text-aqua-primary-400" />
                Access Key (Password)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 w-full py-6 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-aqua-primary-500/30 transition-all transform active:scale-95 uppercase tracking-[.2em] flex items-center justify-center space-x-3 group/btn text-sm"
            >
              <span>Initialize Profile</span>
              <FaUserPlus className="group-hover:scale-110 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Identity Already Logs?{" "}
              <Link to="/login" className="text-aqua-primary-400 font-bold hover:underline ml-2">
                Access Terminal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
