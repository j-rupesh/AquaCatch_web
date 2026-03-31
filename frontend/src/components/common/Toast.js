import React, { useState, useEffect } from "react";
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

function Toast({ message, type = "success", duration = 4000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Wait for transition
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: "bg-emerald-500",
      icon: <FaCheckCircle className="text-xl" />,
      border: "border-emerald-100",
      glow: "shadow-emerald-500/20"
    },
    error: {
      bg: "bg-rose-500",
      icon: <FaExclamationCircle className="text-xl" />,
      border: "border-rose-100",
      glow: "shadow-rose-500/20"
    },
    info: {
      bg: "bg-aqua-primary-500",
      icon: <FaInfoCircle className="text-xl" />,
      border: "border-aqua-primary-100",
      glow: "shadow-aqua-primary-500/20"
    }
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`fixed top-8 right-4 sm:right-8 z-[2000] flex items-center justify-between min-w-[320px] max-w-md p-5 rounded-lg bg-white border border-gray-100 shadow-2xl animate-fade-in transform transition-all translate-x-0 slide-in-right scale-100`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 flex items-center justify-center text-white rounded-2xl shadow-lg ${currentStyle.bg} ${currentStyle.glow}`}>
            {currentStyle.icon}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{type === 'success' ? 'Protocol Confirmed' : 'Security Alert'}</span>
          <span className="text-sm font-bold text-gray-800 tracking-tight leading-none uppercase">{message}</span>
        </div>
      </div>
      <button
        onClick={() => {
            setIsVisible(false);
            onClose?.();
        }}
        className="ml-6 w-8 h-8 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-all active:scale-95"
      >
        <FaTimes />
      </button>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-50/50 w-full overflow-hidden rounded-b-lg">
        <div 
           className={`h-full ${currentStyle.bg} origin-left animate-progress`}
           style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
}

export default Toast;
