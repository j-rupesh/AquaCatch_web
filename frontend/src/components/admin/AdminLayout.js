import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleScroll = (e) => {
    setScrolled(e.target.scrollTop);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-poppins">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`relative flex flex-col flex-1 overflow-x-hidden transition-all duration-500 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}>
        {/* Navbar Component */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} scrolled={scrolled} />

        <main 
          onScroll={handleScroll}
          className="flex-1 p-4 sm:p-8 pt-44 bg-[#f8fafc] overflow-y-auto custom-scrollbar overflow-x-hidden"
        >
          <div className="max-w-7xl mx-auto animate-fade-in mb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
