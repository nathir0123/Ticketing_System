import api from '../api/axios';

const TicketDetailModal = ({ ticket, isStaff, onClose, refresh }) => {

  // Detect file type for preview
  const getFileType = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase().split('?')[0];
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (extension === 'pdf') return 'pdf';
    return 'other';
  };

  const fileType = getFileType(ticket.attachment);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`tickets/${ticket.id}/status/`, { status: newStatus });
      refresh();
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Update failed"));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60  p-0 sm:p-4">
      {/* Mobile: Slides from bottom, full width.
         Desktop: Centered, max-width-2xl.
      */}
      <div className="bg-white rounded-t-[32px] sm:rounded-[32px] w-full max-w-2xl relative shadow-2xl max-h-[95vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

        {/* ---------- HEADER ---------- */}
        <div className="p-6 sm:p-8 pb-4">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-xl sm:text-2xl font-black text-[#004d55] mb-2 pr-8 leading-tight">
            {ticket.title}
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 bg-teal-50 text-[#004d55] rounded-md border border-teal-100/50">
              {ticket.category || 'General'}
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-400 rounded-md">
              ID: #{ticket.id}
            </span>
          </div>
        </div>

        {/* ---------- SCROLLABLE BODY ---------- */}
        <div className="px-6 sm:px-8 pb-6 overflow-y-auto flex-1 custom-scrollbar">

          {/* Issue Description */}
          <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl mb-6 border border-gray-100">
            <p className="text-[10px] font-black text-gray-300 uppercase mb-2 tracking-widest">
              Issue Description
            </p>
            <p className="whitespace-pre-wrap text-sm sm:text-base text-gray-700 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Attachment Preview (Responsive Height) */}
          {ticket.attachment && (
            <div className="mb-6">
              <p className="text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest">
                Attachment Preview
              </p>

              <div className="border rounded-2xl overflow-hidden bg-gray-100 shadow-inner">
                {fileType === 'image' && (
                  <img
                    src={ticket.attachment}
                    alt="preview"
                    className="w-full h-auto max-h-64 sm:max-h-80 object-contain bg-white"
                  />
                )}

                {fileType === 'pdf' && (
                  <div className="w-full h-64 sm:h-96">
                    <iframe
                      src={`${ticket.attachment}#view=FitH`}
                      className="w-full h-full border-none"
                      title="PDF Preview"
                    />
                  </div>
                )}

                {fileType === 'other' && (
                  <div className="p-8 text-center bg-white">
                    <p className="text-xs text-gray-400 mb-4 font-bold">
                      Preview not supported on mobile.
                    </p>
                    <a
                      href={ticket.attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-[#004d55] text-white px-6 py-3 rounded-xl font-bold text-xs"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-2 text-right">
                <a
                  href={ticket.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-black text-[#004d55] hover:underline uppercase tracking-tighter"
                >
                  Open Original ↗
                </a>
              </div>
            </div>
          )}

          {/* Activity History */}
          <div className="mb-4">
            <p className="text-[10px] font-black text-gray-300 uppercase mb-4 tracking-widest">
              Activity History
            </p>

            <div className="space-y-4">
              {ticket.status_history?.length > 0 ? (
                ticket.status_history.map((log, index) => (
                  <div key={index} className="flex gap-4 items-start border-l-2 border-teal-50 pl-4 relative">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>
                    <div className="text-xs">
                      <p className="text-gray-700 font-bold">
                        Status → <span className="text-[#004d55]">{log.new_status}</span>
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {log.changed_by || 'Admin'} • {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-gray-300 italic text-center py-2">No activity logs recorded.</p>
              )}
            </div>
          </div>
        </div>

        {/* ---------- STICKY FOOTER ---------- */}
        <div className="p-6 bg-white border-t border-gray-100 rounded-b-[32px]">
          <p className="text-[10px] font-black text-gray-300 uppercase mb-3 tracking-widest">
            {isStaff ? "Update Ticket Status" : "Current Status"}
          </p>

          {isStaff ? (
            <div className="flex gap-2">
              {['NEW', 'REVIEW', 'RESOLVED'].map(status => (
                <button
                  key={status}
                  disabled={ticket.status === status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`flex-1 py-3.5 rounded-xl text-[10px] font-black transition-all ${
                    ticket.status === status
                      ? 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                      : 'bg-[#004d55] text-white hover:bg-[#00363b] shadow-lg active:scale-95'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="text-xs font-bold text-gray-400">Status:</span>
              <span className="px-3 py-1 bg-[#004d55] text-white rounded-lg font-black text-[10px] uppercase">
                {ticket.status}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;