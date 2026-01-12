import { useState } from 'react';

const FilePasswordModal = ({ isOpen, onClose, onSuccess, record }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('dost_token');
            const res = await fetch(`http://localhost:5000/api/records/${record.record_id}/verify`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Pass the file path back to the parent to open it
                onSuccess(record.file_path);
                onClose();
                setPassword('');
            } else {
                setError(data.message || "Access Denied. Incorrect Password.");
            }
        } catch (err) {
            setError("Server connection failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-zoom-in">
                {/* Security Header */}
                <div className="bg-red-50 p-6 border-b border-red-100 flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-white text-red-600 rounded-full flex items-center justify-center mb-3 shadow-sm border border-red-100">
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Restricted Document</h3>
                    <p className="text-xs font-medium text-red-500 uppercase tracking-wide mt-1">Classification: Confidential</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Security Clearance Required</label>
                        <div className="relative">
                            <input 
                                type="password" 
                                autoFocus
                                required
                                placeholder="Enter File Password"
                                className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-bold text-slate-700 tracking-widest"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 mt-3 text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg animate-pulse">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {error}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-lg shadow-red-200 transition-all flex justify-center items-center gap-2">
                            {loading ? 'Verifying...' : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                                    Unlock
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FilePasswordModal;