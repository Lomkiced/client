import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// --- HELPER: FORMAT BYTES ---
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const RecordModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // DATA SOURCES
  const [regions, setRegions] = useState([]);
  const [codexCategories, setCodexCategories] = useState([]); 
  const [codexTypes, setCodexTypes] = useState([]); 
  const [availableTypes, setAvailableTypes] = useState([]);

  // FORM STATE
  const [formData, setFormData] = useState({
    title: '',
    region_id: '',
    category_name: '',
    classification_rule: '',
    retention_period: '',
    file: null,
    is_restricted: false, // New Field
    file_password: ''     // New Field
  });

  useEffect(() => {
    if (isOpen) {
        // Reset Form
        setFormData({
            title: '',
            region_id: user.role === 'SUPER_ADMIN' ? '' : user.region_id,
            category_name: '',
            classification_rule: '',
            retention_period: '',
            file: null,
            is_restricted: false,
            file_password: ''
        });
        setUploadProgress(0);

        const fetchData = async () => {
            const token = localStorage.getItem('dost_token');
            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                const [reg, cat, typ] = await Promise.all([
                    fetch('http://localhost:5000/api/regions', { headers }),
                    fetch('http://localhost:5000/api/codex/categories', { headers }),
                    fetch('http://localhost:5000/api/codex/types', { headers })
                ]);
                if (reg.ok) setRegions(await reg.json());
                if (cat.ok) setCodexCategories(await cat.json());
                if (typ.ok) setCodexTypes(await typ.json());
            } catch(e) { console.error(e); }
        };
        fetchData();
    }
  }, [isOpen, user]);

  // --- DRAG & DROP HANDLERS ---
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (file.type !== 'application/pdf') return alert("Invalid Format. PDF only.");
    if (!file.name.toLowerCase().endsWith('.pdf')) return alert("Extension error. PDF only.");

    const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
    setFormData(prev => ({ ...prev, file: file, title: prev.title || cleanTitle }));
  };

  // --- FILTERS ---
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const catObj = codexCategories.find(c => c.name === val);
    setFormData(p => ({ ...p, category_name: val, classification_rule: '', retention_period: '' }));
    if (catObj) setAvailableTypes(codexTypes.filter(t => t.category_id === catObj.category_id));
    else setAvailableTypes([]);
  };

  const handleClassificationChange = (e) => {
    const val = e.target.value;
    const rule = availableTypes.find(t => t.type_name === val);
    setFormData(p => ({ ...p, classification_rule: val, retention_period: rule ? (rule.retention_period || 'Permanent') : 'Permanent' }));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Security Check
    if (formData.is_restricted && !formData.file_password) {
        return alert("Please enter a password for this restricted file.");
    }

    setLoading(true);
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress > 90) progress = 90;
        setUploadProgress(progress);
    }, 200);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
        const token = localStorage.getItem('dost_token');
        const res = await fetch('http://localhost:5000/api/records', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: data
        });

        clearInterval(interval);
        setUploadProgress(100);

        if (res.ok) {
            setTimeout(() => { onSuccess(); onClose(); }, 500);
        } else {
            const err = await res.json();
            alert(err.message || "Upload failed.");
            setUploadProgress(0);
        }
    } catch (err) { 
        console.error(err); 
        alert("Network Error"); 
    } finally { 
        setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-zoom-in border border-white/20">
         
         <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-center">
            <div>
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Archive Document</h2>
                <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Secure PDF Repository</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* DROP ZONE */}
            <div 
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 group cursor-pointer
                ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input type="file" required accept=".pdf,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files.length > 0 && validateAndSetFile(e.target.files[0])} />
                
                {formData.file ? (
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{formData.file.name}</p>
                            <p className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">{formatBytes(formData.file.size)}</p>
                        </div>
                        <button type="button" onClick={(e) => {e.preventDefault(); setFormData({...formData, file: null})}} className="z-20 p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"><svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                    </div>
                ) : (
                    <div className="space-y-2 pointer-events-none">
                        <div className="mx-auto w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-sm font-bold text-indigo-600">Click to upload PDF</p>
                    </div>
                )}
            </div>

            {/* METADATA FIELDS */}
            <div className="space-y-3">
                <input required className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Document Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />

                <div className="grid grid-cols-2 gap-3">
                     <select required disabled={user.role !== 'SUPER_ADMIN'} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50" value={formData.region_id} onChange={e => setFormData({...formData, region_id: e.target.value})}>
                         {user.role !== 'SUPER_ADMIN' && <option value={user.region_id}>My Region</option>}
                         {user.role === 'SUPER_ADMIN' && (
                             <>
                                 <option value="">Select Region...</option>
                                 {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                             </>
                         )}
                     </select>
                     
                     <select required className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-indigo-500/20" value={formData.category_name} onChange={handleCategoryChange}>
                         <option value="">Select Category...</option>
                         {codexCategories.map(c => <option key={c.category_id} value={c.name}>{c.name}</option>)}
                     </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                     <select required disabled={!formData.category_name} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50" value={formData.classification_rule} onChange={handleClassificationChange}>
                        <option value="">Classification...</option>
                        {availableTypes.map(t => <option key={t.type_id} value={t.type_name}>{t.type_name}</option>)}
                     </select>
                     <input readOnly value={formData.retention_period || 'Retention'} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 outline-none" />
                </div>
            </div>

            {/* --- SECURITY SECTION (NEW) --- */}
            <div className={`p-4 rounded-xl border transition-all ${formData.is_restricted ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${formData.is_restricted ? 'bg-white text-red-600 shadow-sm' : 'bg-white text-slate-400'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${formData.is_restricted ? 'text-red-700' : 'text-slate-600'}`}>Restricted Access</p>
                            <p className="text-[10px] text-slate-400">Require password to view file</p>
                        </div>
                    </div>
                    
                    {/* TOGGLE SWITCH */}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={formData.is_restricted} onChange={(e) => setFormData({...formData, is_restricted: e.target.checked, file_password: ''})} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                </div>

                {/* PASSWORD INPUT (Conditionally Rendered) */}
                {formData.is_restricted && (
                    <div className="mt-4 animate-fade-in-up">
                        <label className="block text-[10px] font-bold text-red-500 uppercase mb-1 ml-1">Set Access Password</label>
                        <input 
                            type="password" 
                            required={formData.is_restricted}
                            placeholder="Enter password..." 
                            className="w-full px-4 py-2.5 bg-white border border-red-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 text-red-600 placeholder-red-300 font-bold"
                            value={formData.file_password}
                            onChange={(e) => setFormData({...formData, file_password: e.target.value})}
                        />
                    </div>
                )}
            </div>

            {loading && <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden"><div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>}

            <div className="pt-1 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg">{loading ? 'Uploading...' : 'Confirm Upload'}</button>
            </div>
         </form>
      </div>
    </div>
  );
};

export default RecordModal;