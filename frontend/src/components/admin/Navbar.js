import React, { useState, useEffect } from "react";
import { FaBell, FaSearch, FaUser, FaBars } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar, isSidebarOpen, scrolled }) => {
  const { user } = useAuth();
  const [hide, setHide] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  // We are receiving the 'scrolled' prop which is the scrollTop from the main container
  useEffect(() => {
    if (scrolled > lastScroll && scrolled > 100) {
      setHide(true);
    } else {
      setHide(false);
    }
    setLastScroll(scrolled);
  }, [scrolled]);

  return (
    <nav className={`fixed top-4 right-4 left-4 lg:left-auto lg:right-8 z-30 flex items-center justify-between h-20 px-8 transition-all duration-500 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-lg shadow-premium ${isSidebarOpen ? "lg:w-[calc(100%-35rem)]" : "lg:w-[calc(100%-35em)]"} ${hide ? "-translate-y-32" : "translate-y-0"}`}>
      <div className="flex items-center gap-6">
        {/* Mobile Toggle */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-3 bg-gray-50 rounded-2xl text-gray-500 hover:bg-aqua-primary-500 hover:text-white transition-all shadow-sm"
        >
          <FaBars />
        </button>

        {/* Search Bar */}
        <div className="relative hidden md:block group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <FaSearch className="w-4 h-4 text-gray-400 group-focus-within:text-aqua-primary-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-72 px-14 py-3 text-sm font-bold text-gray-900 border-2 border-transparent bg-gray-50 rounded-lg focus:bg-white focus:border-aqua-primary-200 outline-none transition-all placeholder:text-gray-300"
            placeholder="Search Intelligence..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-4 text-gray-400 bg-gray-50 rounded-lg hover:text-aqua-primary-500 hover:bg-aqua-primary-50 transition-all group active:scale-95 shadow-sm border border-transparent hover:border-aqua-primary-100">
          <FaBell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-3.5 right-3.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-md"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-gray-100 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all">
          <div className="flex flex-col items-end text-sm">
            <span className="font-black text-gray-900 tracking-tighter uppercase text-[10px] group-hover:text-aqua-primary-500 transition-colors">
              {user?.name || "System Admin"}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || "admin"}</span>
          </div>
          <div className="relative w-12 h-12 overflow-hidden bg-aqua-dark rounded-2xl border-4 border-gray-50 group-hover:border-aqua-primary-500 transition-all shadow-lg">
             <div className="w-full h-full flex items-center justify-center text-white font-black text-xl">
               {user?.name?.[0] || <FaUser />}
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
