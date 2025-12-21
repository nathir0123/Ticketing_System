import React from 'react';

const TicketTable = ({ tickets, loading, isStaff, onSelect }) => {
  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-12 md:p-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-100 border-t-[#004d55] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse tracking-wide text-sm">Fetching Records...</p>
        </div>
      </div>
    );
  }

  // --- 2. EMPTY STATE ---
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-12 md:p-20 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-gray-500 font-black text-lg">No Tickets Found</h3>
      </div>
    );
  }

  // Helper to get status colors (Keeps code clean and reusable)
  const getStatusColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REVIEW':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'NEW':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="w-full">
      {/* --- DESKTOP TABLE VIEW --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                {isStaff && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>}
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tickets.map((t) => (
                <tr 
                  key={t.id} 
                  onClick={() => onSelect(t)} 
                  className="hover:bg-teal-50/30 cursor-pointer transition-all duration-200 group"
                >
                  <td className="px-6 py-5">
                    <span className="font-bold text-gray-800 group-hover:text-[#004d55] transition-colors">{t.title}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-teal-50 text-[#004d55] border border-teal-100/50">
                      {t.category}
                    </span>
                  </td>
                  {isStaff && (
                    <td className="px-6 py-5 text-sm text-gray-500 italic">
                      {t.username || t.created_by}
                    </td>
                  )}
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MOBILE CARD VIEW --- */}
      <div className="md:hidden space-y-4">
        {tickets.map((t) => (
          <div 
            key={t.id} 
            onClick={() => onSelect(t)}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              {/* FIXED: Now uses getStatusColor helper for mobile too */}
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusColor(t.status)}`}>
                {t.status}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.category}</span>
            </div>
            <h3 className="font-black text-[#004d55] text-lg leading-tight mb-1">{t.title}</h3>
            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{t.description}</p>
            
            {isStaff && (
              <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 border border-gray-200 uppercase">
                  {(t.username || t.created_by || 'U').charAt(0)}
                </div>
                <span className="text-xs text-gray-400 italic">{t.username || t.created_by}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketTable;