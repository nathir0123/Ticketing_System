import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Controls mobile visibility

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  return (
    <>
      {/* --- MOBILE TOP BAR (Visible only on Mobile) --- */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-100 p-4 sticky top-0 z-[60] shadow-sm">
        <h1 className="text-xl font-black text-[#004d55] tracking-tight">
          Support<span className="text-gray-300">Center</span>
        </h1>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="p-2 text-[#004d55] hover:bg-teal-50 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* --- SIDEBAR PANEL --- */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-gray-100 p-6 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex-1">
            <h1 className="hidden md:block text-2xl font-black text-[#004d55] mb-10 px-2 tracking-tight">
              Support<span className="text-gray-300">Center</span>
            </h1>
            
            <nav className="space-y-2">
              <button className="flex items-center gap-3 w-full px-4 py-3 bg-teal-50 text-[#004d55] rounded-xl font-bold transition-all border border-teal-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
            </nav>
          </div>

          {/* Logout Section */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-black text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/20 z-[65] md:hidden backdrop-blur-sm" 
        />
      )}
    </>
  );
};

export default Sidebar;