
const DocumentViewerModal = ({ isOpen, onClose, fileUrl, fileName, isRestricted }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-700/50">
        
        {/* TOOLBAR */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${isRestricted ? 'bg-red-50 border-red-100' : 'bg-slate-900 border-slate-700'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isRestricted ? 'bg-red-100 text-red-600' : 'bg-indigo-500 text-white'}`}>
                    {isRestricted ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    )}
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${isRestricted ? 'text-red-900' : 'text-white'}`}>{fileName}</h3>
                    <p className={`text-xs font-medium ${isRestricted ? 'text-red-500' : 'text-slate-400'}`}>
                        {isRestricted ? 'Confidential • Secure Viewing Mode' : 'Public Record • Standard Access'}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                <button onClick={onClose} className={`p-2 rounded-lg transition-all ${isRestricted ? 'text-red-400 hover:bg-red-100 hover:text-red-600' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </div>

        {/* IFRAME VIEWER */}
        <div className="flex-1 bg-slate-200 relative group overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-0">
                <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
            <iframe src={fileUrl} className="w-full h-full relative z-10 border-none" title="Document Viewer"></iframe>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;