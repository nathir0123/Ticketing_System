import React from 'react';

const TicketTable = ({ tickets, loading, isStaff, onSelect }) => {
  // 1. LOADING STATE
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="p-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-teal-100 border-t-[#004d55] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse tracking-wide">Fetching Records...</p>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-100 p-20 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-gray-500 font-black text-lg">No Tickets Found</h3>
        <p className="text-gray-400 text-sm max-w-xs mt-1">
          We couldn't find any tickets matching your current filters or search criteria.
        </p>
      </div>
    );
  }

  // 3. TABLE DATA
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
              {isStaff && (
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
              )}
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
                {/* Title */}
                <td className="px-6 py-5">
                  <span className="font-bold text-gray-800 group-hover:text-[#004d55] transition-colors">
                    {t.title}
                  </span>
                </td>

                {/* Description (Truncated) */}
                <td className="px-6 py-5">
                  <p className="text-sm text-gray-500 line-clamp-1 max-w-[300px]">
                    {t.description}
                  </p>
                </td>

                {/* Category Badge */}
                <td className="px-6 py-5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-teal-50 text-[#004d55] border border-teal-100/50">
                    {t.category}
                  </span>
                </td>

                {/* Staff User Column */}
                {isStaff && (
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border border-gray-200 uppercase">
                        {(t.username || t.created_by || 'U').charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600 font-medium italic">
                        {t.username || t.created_by}
                      </span>
                    </div>
                  </td>
                )}

                {/* Status Badge */}
                <td className="px-6 py-5 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                    t.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border border-green-200' : 
                    t.status === 'REVIEW' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;