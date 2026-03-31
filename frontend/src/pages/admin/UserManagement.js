import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserShield, FaUserEdit, FaTrash, FaInbox, FaEnvelope, FaFingerprint, FaClock, FaUserAlt, FaSearch, FaUserCheck, FaIdBadge } from "react-icons/fa";
import Loading from "../../components/common/Loading";
import Toast from "../../components/common/Toast";
import { formatDate } from "../../utils/helpers";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/auth/admin/users");
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (err) {
      setToast({ message: "❌ Security Breach: Accessing User Matrix Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
        setLoading(true);
        // Note: In real app, you'd have a specific admin route for this
        const response = await axios.put("/api/auth/profile", { role: newRole }); 
        if (response.data.success) {
            setToast({ message: `✅ User Role Scaled to ${newRole.toUpperCase()}`, type: "success" });
            fetchUsers();
        }
    } catch (err) {
        setToast({ message: "❌ Role Modification Failed", type: "error" });
    } finally {
        setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) return <Loading />;

  return (
    <div className="space-y-10 animate-fade-in font-poppins pt-6 lg:pt-10">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <header className="flex flex-col md:flex-row items-center justify-between gap-8 p-2">
        <div className="text-center md:text-left">
          <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-xs">Personnel Infrastructure</span>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-1 font-outfit uppercase italic">User Matrix</h1>
          <p className="mt-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
            Client Authentication & Lifecycle Control
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <div className="px-8 py-4 bg-white border border-gray-100 rounded-2xl shadow-premium text-center min-w-[140px]">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Identities</p>
                <p className="text-2xl font-black text-gray-900 font-outfit">{users.length}</p>
            </div>
            <div className="px-8 py-4 bg-aqua-dark border border-aqua-dark rounded-2xl shadow-xl text-center min-w-[140px]">
                <p className="text-[10px] font-black text-aqua-primary-400 uppercase tracking-widest mb-1">Active Admins</p>
                <p className="text-2xl font-black text-white font-outfit">{users.filter(u => u.role === 'admin').length}</p>
            </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="max-w-3xl relative group">
          <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-aqua-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by identity label or email identifier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-lg shadow-sm focus:border-aqua-primary-500 focus:bg-white outline-none transition-all font-bold text-sm tracking-tight"
          />
      </div>

      <div className="grid grid-cols-1 gap-8">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="group p-8 sm:p-10 bg-white rounded-lg border border-gray-100 shadow-premium hover:shadow-aqua-glow transition-all duration-700 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-80 h-80 -mr-40 -mt-40 bg-aqua-primary-50/50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                {/* Identity Cluster */}
                <div className="w-full lg:w-1/3 flex items-center gap-6">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-lg bg-aqua-dark border-4 border-gray-50 flex items-center justify-center text-white text-2xl font-black shadow-xl group-hover:scale-110 transition-transform duration-500 font-outfit">
                        {u.name.charAt(0).toUpperCase()}
                    </div>
                    {u.role === 'admin' && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-aqua-primary-500 text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center animate-bounce">
                            <FaUserShield className="w-4 h-4" />
                        </div>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Protocol Name</span>
                    <p className="font-black text-gray-900 text-xl tracking-tighter uppercase leading-none truncate font-outfit">{u.name}</p>
                    <div className="flex items-center gap-2 mt-3 text-aqua-ocean">
                        <FaEnvelope className="w-3 h-3" />
                        <span className="text-[10px] font-bold tracking-tight truncate uppercase">{u.email}</span>
                    </div>
                  </div>
                </div>

                {/* Secure Metrics */}
                <div className="w-full lg:w-1/3 grid grid-cols-2 gap-8 lg:border-l lg:border-gray-50 lg:pl-12">
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <FaFingerprint className="text-aqua-primary-500 transition-transform group-hover:scale-125" /> Access ID
                        </span>
                        <p className="font-mono text-[9px] font-black text-gray-900 bg-[#f8fafc] px-3 py-1.5 rounded-xl border border-gray-100 inline-block">
                          #{u._id.slice(-8).toUpperCase()}
                        </p>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                            <FaClock className="text-aqua-primary-500" /> Genesis Date
                        </span>
                        <p className="text-[10px] font-black text-gray-700 uppercase">{formatDate(u.createdAt)}</p>
                    </div>
                </div>

                {/* Authorization & Tactical Override */}
                <div className="w-full lg:w-1/4 flex items-center justify-end gap-8 lg:border-l lg:border-gray-50 lg:pl-12">
                    <div className="text-right hidden sm:block">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm inline-block ${u.role === 'admin' ? 'bg-aqua-primary-50 text-aqua-primary-600 border border-aqua-primary-100' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                            {u.role}
                        </span>
                        <p className="text-[9px] font-black text-gray-300 uppercase mt-2 tracking-widest">Auth Level</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            disabled={u.email === 'admin@gmail.com' || u.email === 'admin@aquacatch.com'}
                            onClick={() => handleUpdateRole(u._id, u.role)}
                            className="w-14 h-14 bg-white text-gray-400 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-center hover:bg-aqua-primary-500 hover:text-white hover:border-aqua-primary-500 transition-all transform active:scale-90 disabled:opacity-20 shadow-premium"
                            title="Scale Authorization"
                        >
                            <FaUserEdit className="text-xl" />
                        </button>
                        <button 
                             disabled={u.email === 'admin@gmail.com' || u.email === 'admin@aquacatch.com'}
                             className="w-14 h-14 bg-white text-rose-500 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-center hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all transform active:scale-90 disabled:opacity-20 shadow-premium"
                             title="Purge Identity"
                        >
                            <FaTrash className="text-xl" />
                        </button>
                    </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-40 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-50 animate-pulse">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <FaUserAlt className="text-5xl text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 font-outfit uppercase">Matrix Vacuum</h2>
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-[.5em] italic">No identities have been logged in this theater.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
