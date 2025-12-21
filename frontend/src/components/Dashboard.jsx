import { useEffect, useState, useCallback, useMemo } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';
import TicketTable from './TicketTable';
import TicketDetailModal from './TicketDetailModal';
import CreateTicketModal from './CreateTicketModal';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  // --- 1. STATE ---
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // --- 2. ROLE DETECTION ---
  const isStaff = useMemo(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      return decoded.is_staff === true;
    } catch (e) {
      console.error("Token decode failed", e);
      return false;
    }
  }, []);

  // --- 3. TAWK.TO CHAT CONTROL ---
  useEffect(() => {
    const toggleChat = () => {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        if (isCreateOpen || selectedTicket) {
          window.Tawk_API.hideWidget();
        } else {
          window.Tawk_API.showWidget();
        }
      }
    };

    toggleChat();

    if (window.Tawk_API) {
      window.Tawk_API.onLoad = toggleChat;
    }
  }, [isCreateOpen, selectedTicket]);

  // --- 4. DATA FETCHING ---
  const fetchTickets = useCallback(async (pageNumber) => {
    setLoading(true);
    try {
      const response = await api.get('tickets/', {
        params: { 
          search, 
          status: statusFilter, 
          category: categoryFilter,
          page: pageNumber 
        }
      });
      
      if (response.data.results) {
        setTickets(response.data.results);
        setTotalCount(response.data.count);
      } else {
        setTickets(response.data);
        setTotalCount(response.data.length);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1); 
      fetchTickets(1); 
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, statusFilter, categoryFilter, fetchTickets]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTickets(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  // --- 5. RENDER ---
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <Sidebar isStaff={isStaff} />

      {/* IMPORTANT: This container only wraps the background content. 
          When a modal is open, we blur THIS div and disable clicks on it.
      */}
      <div className={`flex-1 p-4 md:p-8 transition-all duration-500 ${
        (isCreateOpen || selectedTicket) ? 'pointer-events-none ' : ''
      }`}>
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#004d55] tracking-tight">
                {isStaff ? 'Admin Panel' : 'Support Center'}
              </h1>
              <p className="text-gray-400 text-xs md:text-sm font-medium italic">Manage requests efficiently</p>
            </div>
            {!isStaff && (
              <button 
                onClick={() => setIsCreateOpen(true)} 
                className="w-full sm:w-auto bg-[#004d55] text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-teal-900/20 hover:bg-[#003a40] transition-all active:scale-95 text-sm"
              >
                + New Ticket
              </button>
            )}
          </div>

          {/* FILTERS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative col-span-1 sm:col-span-2 lg:col-span-2">
               <input 
                type="text" 
                placeholder="Search by title..." 
                className="w-full p-3.5 pl-10 rounded-xl border border-gray-100 bg-white focus:border-[#004d55] outline-none transition-all shadow-sm text-sm" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
              <svg className="absolute left-3 top-4 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select 
              className="w-full p-3.5 rounded-xl border border-gray-100 bg-white font-medium text-gray-600 outline-none shadow-sm text-sm cursor-pointer" 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="NEW">New</option>
              <option value="REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select 
              className="w-full p-3.5 rounded-xl border border-gray-100 bg-white font-medium text-gray-600 outline-none shadow-sm text-sm cursor-pointer" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="TECH">Technical</option>
              <option value="FIN">Finance</option>
              <option value="PROD">Product</option>
            </select>
          </div>

          <TicketTable 
            tickets={tickets} 
            loading={loading} 
            isStaff={isStaff} 
            onSelect={setSelectedTicket} 
          />

          {/* PAGINATION */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 gap-4">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest text-center">
                Showing <span className="text-[#004d55]">{tickets.length}</span> of {totalCount} TICKETS
              </span>
              
              <div className="flex items-center gap-3">
                <button 
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="p-2 rounded-lg border border-gray-100 disabled:opacity-20 text-[#004d55]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="bg-gray-50 px-4 py-2 rounded-xl text-xs font-black text-[#004d55]">
                  {page} / {totalPages}
                </div>

                <button 
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="p-2 rounded-lg border border-gray-100 disabled:opacity-20 text-[#004d55]"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS ARE PLACED HERE (Outside the blurred div)
          We use z-[999] to ensure they are on top of everything.
      */}
      <div className="relative z-[999]">
        {selectedTicket && (
          <TicketDetailModal 
            ticket={selectedTicket} 
            isStaff={isStaff} 
            onClose={() => setSelectedTicket(null)} 
            refresh={() => fetchTickets(page)} 
          />
        )}
        
        {isCreateOpen && (
          <CreateTicketModal 
            onClose={() => setIsCreateOpen(false)} 
            refresh={() => fetchTickets(1)} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;