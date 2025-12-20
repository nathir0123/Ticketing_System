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

  // Handle status update (staff only)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 text-left">
      <div className="bg-white rounded-3xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ---------- HEADER (FIXED) ---------- */}
        <div className="p-8 pb-4">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-2xl font-bold text-gray-400 hover:text-red-500 transition-colors"
          >
            &times;
          </button>

          <h2 className="text-2xl font-black text-gray-800 mb-2">
            {ticket.title}
          </h2>

          <div className="flex gap-2">
            <span className="text-[10px] font-black uppercase px-2 py-1 bg-teal-50 text-[#004d55] rounded-md border border-teal-100">
              {ticket.category || 'General'}
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
              ID: #{ticket.id}
            </span>
          </div>
        </div>

        {/* ---------- SCROLLABLE CONTENT ---------- */}
        <div className="px-8 pb-6 overflow-y-auto flex-1 pr-6 custom-scrollbar">

          {/* Issue Description */}
          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 leading-relaxed text-gray-700">
            <p className="text-xs font-black text-gray-400 uppercase mb-2">
              Issue Description
            </p>
            <p className="whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Attachment Preview */}
          {ticket.attachment && (
            <div className="mb-8">
              <p className="text-xs font-black text-gray-400 uppercase mb-3">
                Attachment Preview
              </p>

              <div className="border rounded-2xl overflow-hidden bg-gray-100 shadow-inner">

                {fileType === 'image' && (
                  <img
                    src={ticket.attachment}
                    alt="preview"
                    className="w-full h-auto max-h-80 object-contain bg-white"
                  />
                )}

                {fileType === 'pdf' && (
                  <div className="w-full h-96">
                    <iframe
                      src={`${ticket.attachment}#toolbar=0`}
                      className="w-full h-full"
                      title="PDF Preview"
                    />
                  </div>
                )}

                {fileType === 'other' && (
                  <div className="p-8 text-center bg-white">
                    <p className="text-sm text-gray-500 mb-4 font-medium">
                      Preview not available for this file type.
                    </p>
                    <a
                      href={ticket.attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block bg-[#004d55] text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-[#00363b] transition-all"
                    >
                      Download / View File
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-2 text-right">
                <a
                  href={ticket.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#004d55] hover:underline"
                >
                  Open in New Tab ↗
                </a>
              </div>
            </div>
          )}

          {/* Activity History */}
          <div className="mb-4">
            <p className="text-xs font-black text-gray-400 uppercase mb-4 tracking-wider">
              Activity History
            </p>

            <div className="space-y-4">
              {ticket.status_history && ticket.status_history.length > 0 ? (
                ticket.status_history.map((log, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start border-l-2 border-teal-100 pl-4 relative"
                  >
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>

                    <div className="text-sm">
                      <p className="text-gray-800 font-medium">
                        Changed to{' '}
                        <span className="font-bold text-[#004d55]">
                          {log.new_status}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        By{' '}
                        <span className="font-bold text-gray-600">
                          {log.changed_by || 'Admin'}
                        </span>
                        <span className="mx-1">•</span>
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">
                  No activity logs yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ---------- FOOTER (STICKY) ---------- */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
          <p className="text-xs font-black text-gray-400 uppercase mb-4">
            Ticket Actions
          </p>

          {isStaff ? (
            <div className="flex gap-2">
              {['NEW', 'REVIEW', 'RESOLVED'].map(status => (
                <button
                  key={status}
                  disabled={ticket.status === status}
                  onClick={() => handleStatusUpdate(status)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    ticket.status === status
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border'
                      : 'bg-[#004d55] text-white hover:bg-[#00363b] shadow-md active:scale-95'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
              <span className="text-sm font-bold text-gray-500">
                Current Status:
              </span>
              <span className="px-4 py-1 bg-teal-50 text-[#004d55] rounded-lg font-black text-[10px] uppercase border border-teal-100">
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
