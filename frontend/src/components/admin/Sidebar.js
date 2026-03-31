import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaChevronLeft,
  FaArrowLeft,
  FaTimes
} from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/admin", icon: <FaTachometerAlt /> },
    { title: "Inventory", path: "/admin/products", icon: <FaBoxOpen /> },
    { title: "Shipments", path: "/admin/orders", icon: <FaShoppingCart /> },
    { title: "Personnel", path: "/admin/users", icon: <FaUsers /> },
    { title: "System Opts", path: "/admin/settings", icon: <FaCog /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-aqua-dark/50 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={toggleSidebar}
      />

      {/* Sidebar Component */}
      <aside
        className={`fixed top-4 bottom-4 left-4 z-50 transition-all duration-500 rounded-[2.5rem] bg-white border border-gray-100 shadow-premium ${
          isOpen ? "w-72 translate-x-0" : "w-0 lg:w-24 -translate-x-[150%] lg:translate-x-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <Link to="/" className={`flex items-center gap-3 transition-opacity duration-300 ${!isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"}`}>
              <span className="text-2xl filter drop-shadow-md">🐟</span>
              <span className="text-xl font-black italic tracking-tighter uppercase text-aqua-ocean">Aqua<span className="text-aqua-primary-500">Catch</span></span>
            </Link>
            <button
              onClick={toggleSidebar}
              className={`p-3 rounded-2xl bg-gray-50 text-gray-400 hover:bg-aqua-primary-500 hover:text-white transition-all transform active:scale-90 ${!isOpen && "hidden lg:block mx-auto"}`}
            >
              {isOpen ? <FaChevronLeft /> : <FaChevronLeft className="rotate-180" />}
            </button>
            {!isOpen && <button className="lg:hidden p-3 text-aqua-primary-500 bg-aqua-primary-50 rounded-2xl" onClick={toggleSidebar}><FaTimes /></button>}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-8 space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                className={`flex items-center p-5 text-sm font-bold transition-all duration-300 rounded-[1.5rem] group relative ${
                  location.pathname === item.path
                    ? "bg-aqua-dark text-white shadow-2xl shadow-aqua-dark/40"
                    : "text-gray-400 hover:bg-gray-50 hover:text-aqua-ocean"
                }`}
              >
                <div className={`p-3 rounded-xl transition-all duration-500 flex items-center justify-center ${location.pathname === item.path ? "bg-aqua-primary-500" : "bg-gray-50 group-hover:bg-aqua-primary-50"} ${!isOpen && "mx-auto"}`}>
                   <span className="text-xl">{item.icon}</span>
                </div>
                <span className={`ml-4 whitespace-nowrap overflow-hidden transition-all duration-500 uppercase tracking-widest text-[10px] ${!isOpen ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"}`}>
                  {item.title}
                </span>
                {location.pathname === item.path && isOpen && (
                  <div className="absolute right-6 w-2 h-2 bg-aqua-primary-500 rounded-full animate-pulse shadow-lg shadow-aqua-primary-500/50"></div>
                )}
              </Link>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-50">
             <Link 
               to="/" 
               className={`flex items-center justify-center p-5 rounded-[1.5rem] bg-aqua-primary-50 text-aqua-primary-600 font-black hover:bg-aqua-primary-100 transition-all shadow-sm ${!isOpen ? "px-0" : ""}`}
             >
               <FaArrowLeft className={`${isOpen && "mr-3"}`} />
               <span className={`uppercase tracking-tighter text-[11px] transition-all whitespace-nowrap ${!isOpen ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"}`}>Live Portal</span>
             </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
