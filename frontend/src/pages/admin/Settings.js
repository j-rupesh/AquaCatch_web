import React, { useState } from "react";
import { FaCog, FaGlobe, FaShieldAlt, FaTruck, FaBell, FaDatabase, FaSave, FaLock, FaMicrochip, FaServer, FaChartBar } from "react-icons/fa";
import Toast from "../../components/common/Toast";

const Settings = () => {
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    marketplaceName: "AquaCatch",
    deliveryFee: 50,
    taxRate: 18,
    freeDeliveryThreshold: 500,
    maintenanceMode: false,
    emailNotifications: true,
    backupInterval: 'Daily'
  });

  const handleSave = () => {
    setToast({ message: "✅ System Core Parameters Synchronized", type: "success" });
  };

  return (
    <div className="space-y-12 animate-fade-in font-poppins pt-10 lg:pt-16">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <header className="flex flex-col md:flex-row items-center justify-between gap-8 p-2">
        <div className="text-center md:text-left">
          <span className="text-aqua-primary-500 font-bold uppercase tracking-widest text-xs">Logic Configuration</span>
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mt-1 font-outfit uppercase italic">System Core</h1>
          <p className="mt-1 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
            Environmental Parameters & Protocol Logic
          </p>
        </div>
        <button 
            onClick={handleSave}
            className="group flex items-center gap-3 px-10 py-6 bg-aqua-dark text-white font-black rounded-lg shadow-2xl hover:bg-black transition-all transform active:scale-95 uppercase tracking-widest text-xs"
        >
            <FaSave className="text-aqua-primary-500 group-hover:scale-125 transition-transform" /> 
            <span>Commit System Changes</span>
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Market Parameters */}
        <section className="p-10 sm:p-12 bg-white rounded-lg border border-gray-100 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 -mr-40 -mt-40 bg-aqua-primary-50/50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-16 h-16 bg-aqua-primary-50 text-aqua-primary-500 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-sm border border-aqua-primary-100">
                    <FaGlobe />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-outfit">Marketplace Parameters</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global Trade Variables</p>
                </div>
            </div>
            
            <div className="space-y-10 relative z-10">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <FaMicrochip className="text-aqua-primary-500" /> Protocol Branding (Name)
                    </label>
                    <input 
                        type="text" 
                        value={settings.marketplaceName}
                        onChange={(e) => setSettings({...settings, marketplaceName: e.target.value})}
                        className="w-full px-8 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-300 focus:bg-white rounded-lg outline-none transition-all font-black text-gray-900 uppercase tracking-tighter"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                          <FaTruck className="text-aqua-primary-500" /> Logistics Fee (₹)
                        </label>
                        <input 
                            type="number" 
                            value={settings.deliveryFee}
                            onChange={(e) => setSettings({...settings, deliveryFee: e.target.value})}
                            className="w-full px-8 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-300 focus:bg-white rounded-[1.5rem] outline-none transition-all font-black text-gray-900"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                          <FaChartBar className="text-aqua-primary-500" /> Resource Tax (%)
                        </label>
                        <input 
                            type="number" 
                            value={settings.taxRate}
                            onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                            className="w-full px-8 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-300 focus:bg-white rounded-[1.5rem] outline-none transition-all font-black text-gray-900"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Security & System */}
        <section className="p-10 sm:p-12 bg-white rounded-lg border border-gray-100 shadow-premium relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 -mr-40 -mt-40 bg-rose-50/50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="flex items-center gap-6 mb-12 relative z-10">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center text-2xl shadow-sm border border-rose-100">
                    <FaShieldAlt />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight font-outfit">Security Protocols</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Access & Integrity Control</p>
                </div>
            </div>
            
            <div className="space-y-10 relative z-10">
                <div className="flex items-center justify-between p-8 bg-[#f8fafc] rounded-[2rem] border border-gray-100 hover:bg-white hover:border-rose-100 transition-all group/toggle">
                    <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1 group-hover/toggle:text-rose-500 transition-colors">Maintenance Lock</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global Access Blackout</p>
                    </div>
                    <button 
                        onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                        className={`w-16 h-8 rounded-lg ${settings.maintenanceMode ? 'bg-rose-500 active:bg-rose-600' : 'bg-gray-200 active:bg-gray-300'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${settings.maintenanceMode ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="flex items-center justify-between p-8 bg-[#f8fafc] rounded-[2rem] border border-gray-100 hover:bg-white hover:border-aqua-primary-100 transition-all group/toggle">
                    <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest mb-1 group-hover/toggle:text-aqua-primary-500 transition-colors">Correspondence Flow</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Email Notification Pipeline</p>
                    </div>
                    <button 
                        onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        className={`w-16 h-8 rounded-lg ${settings.emailNotifications ? 'bg-aqua-primary-500 active:bg-aqua-primary-600' : 'bg-gray-200 active:bg-gray-300'}`}
                    >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${settings.emailNotifications ? 'translate-x-8' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 flex items-center gap-2">
                        <FaDatabase className="text-aqua-primary-500" /> Ledger Backup Strategy
                    </label>
                    <div className="relative">
                      <select 
                          value={settings.backupInterval}
                          onChange={(e) => setSettings({...settings, backupInterval: e.target.value})}
                          className="w-full px-8 py-5 bg-[#f8fafc] border-2 border-transparent focus:border-aqua-primary-300 focus:bg-white rounded-lg outline-none transition-all font-black text-gray-900 appearance-none uppercase text-xs"
                      >
                          <option>Hourly Delta</option>
                          <option>Full Daily Sync</option>
                          <option>Weekly Archive</option>
                          <option>Cold Storage Mode</option>
                      </select>
                      <FaServer className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    </div>
                </div>
            </div>
        </section>
      </div>

      <div className="p-16 border-4 border-dashed border-gray-100 rounded-lg text-center bg-white shadow-inner group">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:rotate-180 transition-transform duration-[2000ms]">
           <FaCog className="text-4xl text-gray-200 animate-spin-slow" />
        </div>
        <p className="text-xs font-black text-gray-300 uppercase tracking-[.6em] italic">Deep Configuration Modules Restricted to Level-0 Access Only</p>
      </div>
    </div>
  );
};

export default Settings;
