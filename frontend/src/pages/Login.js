import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/common/Toast";
import Loading from "../components/common/Loading";
import { FaEnvelope, FaLock, FaArrowRight, FaSignInAlt } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      setToast({ message: "✅ Identity Protocol Verified!", type: "success" });
      
      const destination = response.user.role === "admin" ? "/admin" : "/";
      setTimeout(() => navigate(destination), 1000);
    } catch (err) {
      setToast({ message: `❌ Access Denied: ${err.message}`, type: "error" });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-aqua-dark flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-aqua-primary-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/2 -right-24 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-float"></div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="w-full max-w-lg relative z-10 animate-slide-up">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] shadow-2xl p-8 sm:p-12 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

          <header className="text-center mb-10">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <span className="text-4xl filter drop-shadow-md">🐟</span>
              <span className="text-3xl font-black italic tracking-tighter uppercase text-white">Aqua<span className="text-aqua-primary-400">Catch</span></span>
            </Link>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest font-outfit">Access Terminal</h2>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Verify identity to continue sequence</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaEnvelope className="text-aqua-primary-400" />
                Auth Identifier (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="USER@DOMAIN.COM"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.3em] ml-2 flex items-center gap-2">
                <FaLock className="text-aqua-primary-400" />
                Encrypted Sequence (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-8 py-5 bg-white/5 border-2 border-transparent focus:border-aqua-primary-400 focus:bg-white focus:text-gray-900 rounded-[1.5rem] outline-none transition-all font-bold text-white placeholder:text-gray-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-aqua-primary-500 hover:bg-aqua-primary-600 text-white font-black rounded-[1.5rem] shadow-xl shadow-aqua-primary-500/30 transition-all transform active:scale-95 uppercase tracking-[.2em] flex items-center justify-center space-x-3 group/btn text-sm"
            >
              <span>Initialize Auth</span>
              <FaSignInAlt className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/10 text-center space-y-4">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              Unrecognized Identity?{" "}
              <Link to="/register" className="text-aqua-primary-400 font-bold hover:underline ml-2">
                Register Protocol
              </Link>
            </p>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 inline-block mx-auto">
               <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Master Admin Override Access</p>
               <p className="text-xs font-mono text-aqua-primary-400 mt-1">admin@aquacatch.com // admin123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
