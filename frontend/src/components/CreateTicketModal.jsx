import { useState, useRef } from 'react';
import api from '../api/axios';

const CreateTicketModal = ({ onClose, refresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachment(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      alert("Please select a category");
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('category', category);
    if (attachment) fd.append('attachment', attachment);

    try {
      await api.post('tickets/', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      refresh();
      onClose();
    } catch { 
      alert("Upload failed."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      {/* Container: Full width on mobile bottom, Centered modal on desktop */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 sm:p-8 rounded-t-[32px] sm:rounded-[32px] w-full max-w-md space-y-5 shadow-2xl text-left max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom sm:zoom-in duration-300"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-black text-[#004d55]">New Ticket</h2>
          <button type="button" onClick={onClose} className="sm:hidden text-gray-400 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <input 
            required 
            placeholder="Subject" 
            className="w-full border border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none focus:border-[#004d55] transition-all text-sm" 
            onChange={e => setTitle(e.target.value)} 
          />
          
          <textarea 
            required 
            placeholder="Explain your issue..." 
            className="w-full border border-gray-100 bg-gray-50 p-4 rounded-2xl h-28 sm:h-32 resize-none outline-none focus:border-[#004d55] transition-all text-sm" 
            onChange={e => setDescription(e.target.value)} 
          />
          
          <div className="relative">
            <select 
              required
              className={`w-full border border-gray-100 bg-gray-50 p-4 rounded-2xl outline-none appearance-none cursor-pointer focus:border-[#004d55] transition-all text-sm ${category === "" ? "text-gray-400" : "text-gray-800"}`}
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="" disabled hidden>Select Issue Type</option>
              <option value="TECH">Technical</option>
              <option value="FIN">Finance</option>
              <option value="PROD">Product</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Attachment Area with Drag & Drop */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Attachment</p>
            <div 
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`group border-2 border-dashed rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                isDragging ? "border-[#004d55] bg-teal-50" : "border-gray-200 hover:border-[#004d55] hover:bg-teal-50/30"
              }`}
            >
              <div className="flex flex-col overflow-hidden mr-2">
                <span className="text-sm font-bold text-gray-600 truncate group-hover:text-[#004d55]">
                  {attachment ? attachment.name : "Drop file here or click"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {attachment ? `${(attachment.size / 1024).toFixed(1)} KB` : "PDF, JPG, PNG up to 10MB"}
                </span>
              </div>
              
              {attachment ? (
                <button 
                  type="button"
                  onClick={handleRemoveFile}
                  className="bg-red-50 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-[#004d55] group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={e => setAttachment(e.target.files[0])} 
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:flex-[1.5] order-1 sm:order-2 py-4 bg-[#004d55] text-white rounded-2xl font-black shadow-lg hover:bg-[#003a40] transition-all disabled:opacity-50"
          >
            {isSubmitting ? "Uploading..." : "Submit Ticket"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-full sm:flex-1 order-2 sm:order-1 py-4 text-gray-400 font-black hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketModal;