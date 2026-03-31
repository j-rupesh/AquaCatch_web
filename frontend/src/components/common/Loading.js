import React from "react";

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center relative">
        {/* Pulsing Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-aqua-primary-500/10 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-aqua-primary-500/5 rounded-full animate-ping opacity-10"></div>
        
        {/* Main Spinner */}
        <div className="relative z-10">
           <div className="w-16 h-16 border-4 border-gray-100 border-t-aqua-primary-500 rounded-full animate-spin mx-auto mb-8 shadow-premium"></div>
           <div className="space-y-2">
             <h2 className="text-xl font-black text-gray-900 uppercase tracking-[.4em] italic font-outfit">Aqua<span className="text-aqua-primary-500">Catch</span></h2>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Initializing Interface...</p>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
