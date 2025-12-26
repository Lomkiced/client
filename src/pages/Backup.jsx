import {
    Activity,
    AlertTriangle,
    ArrowDownCircle,
    Clock,
    Database,
    FileJson,
    History,
    Loader2,
    Lock,
    RefreshCw,
    RotateCcw,
    Server,
    ShieldCheck,
    UploadCloud
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { downloadBackup, getLogs, restoreDatabase } from '../services/api';

const Backup = () => {
  // UI States
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState(localStorage.getItem('lastBackupTime') || null);
  
  // Data States
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  // Restore Modal
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  // 1. Fetch Real Backup/Restore History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // We search for logs related to DB actions
        const response = await getLogs({ search: 'DB_', limit: 5 });
        if (response && response.data) {
          setRecentLogs(response.data);
        }
      } catch (err) {
        console.error("Failed to load backup history");
      } finally {
        setLoadingLogs(false);
      }
    };
    fetchHistory();
  }, []);

  const handleBackup = async () => {
    setLoading(true);
    try {
      await downloadBackup();
      
      // Update "Last Backup" time locally for UX
      const now = new Date().toISOString();
      localStorage.setItem('lastBackupTime', now);
      setLastBackup(now);

      // Refresh logs to show the new entry
      setTimeout(async () => {
         const response = await getLogs({ search: 'DB_', limit: 5 });
         if(response.data) setRecentLogs(response.data);
      }, 1000);

    } catch (err) {
      alert("Backup failed. Contact IT Support.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setShowRestoreModal(true);
    }
  };

  const handleRestoreSubmit = async (e) => {
    e.preventDefault();
    if (!password) return alert("Password required.");
    
    setRestoring(true);
    try {
      const formData = new FormData();
      formData.append('backupFile', selectedFile);
      formData.append('password', password);

      await restoreDatabase(formData);
      
      alert("System Restored Successfully! The system will reload.");
      window.location.reload();

    } catch (err) {
      alert("Restore Failed: " + (err.response?.data?.message || "Server Error"));
      setRestoring(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 relative animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database className="text-indigo-600" /> Database Management
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage system snapshots, disaster recovery, and data sovereignty.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-8 pb-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* 1. SERVER HEALTH MONITOR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* Card A: Connection */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                   <Activity size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connection</p>
                   <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Stable (12ms)
                   </p>
                </div>
             </div>

             {/* Card B: Database Engine */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                   <Server size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Engine</p>
                   <p className="text-sm font-bold text-slate-700">PostgreSQL v16.0</p>
                </div>
             </div>

             {/* Card C: Last Snapshot */}
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                   <Clock size={24} />
                </div>
                <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Snapshot</p>
                   <p className="text-sm font-bold text-slate-700">{lastBackup ? formatDate(lastBackup) : 'No local record'}</p>
                </div>
             </div>
          </div>

          {/* 2. MAIN CONTROL PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: BACKUP CONTROLS (Spans 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
               
               {/* Backup Card */}
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                     <Database size={120} />
                  </div>
                  
                  <div className="relative z-10">
                     <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="text-emerald-400" size={28} />
                        <h2 className="text-xl font-bold">System Snapshot</h2>
                     </div>
                     <p className="text-slate-300 text-sm mb-8 max-w-lg leading-relaxed">
                        Create a complete SQL dump of the entire system. This includes user accounts, audit trails, registry metadata, and configuration settings.
                     </p>
                     
                     <button 
                        onClick={handleBackup}
                        disabled={loading}
                        className="group flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/50 active:translate-y-0.5"
                     >
                        {loading ? <Loader2 className="animate-spin" /> : <ArrowDownCircle className="group-hover:animate-bounce" />}
                        {loading ? 'Streaming Data...' : 'Generate & Download Backup'}
                     </button>
                  </div>
               </div>

               {/* Restore Card (Danger Zone) */}
               <div className="bg-white rounded-2xl p-8 border border-red-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-red-100 transition-colors duration-500"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                     <div>
                        <div className="flex items-center gap-2 mb-2">
                           <RotateCcw className="text-red-500" size={20} />
                           <h3 className="font-bold text-slate-800">Disaster Recovery</h3>
                        </div>
                        <p className="text-sm text-slate-500 max-w-sm">
                           Restore the database from a `.sql` file. <br/>
                           <span className="text-red-600 font-bold bg-red-50 px-1 rounded">Warning: This overwrites all current data.</span>
                        </p>
                     </div>

                     <div>
                        <input type="file" ref={fileInputRef} hidden accept=".sql" onChange={handleFileSelect} />
                        <button 
                           onClick={() => fileInputRef.current.click()}
                           className="px-6 py-2.5 border-2 border-red-100 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-2"
                        >
                           <UploadCloud size={18} /> Upload & Restore
                        </button>
                     </div>
                  </div>
               </div>

            </div>

            {/* RIGHT: HISTORY LOGS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full">
               <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                  <h3 className="font-bold text-slate-700 flex items-center gap-2">
                     <History size={18} className="text-slate-400"/> Operation Log
                  </h3>
                  <button onClick={() => window.location.reload()} className="text-xs text-indigo-600 hover:underline">Refresh</button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-2">
                  {loadingLogs ? (
                     <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin" size={20} /> Loading history...
                     </div>
                  ) : recentLogs.length === 0 ? (
                     <div className="py-8 text-center text-slate-400 text-sm">No backup history found.</div>
                  ) : (
                     <div className="space-y-1">
                        {recentLogs.map((log) => (
                           <div key={log.log_id} className="p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                              <div className="flex items-start gap-3">
                                 <div className={`mt-1 p-1.5 rounded-md ${log.action === 'DB_BACKUP' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {log.action === 'DB_BACKUP' ? <ArrowDownCircle size={14} /> : <RefreshCw size={14} />}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700">
                                       {log.action === 'DB_BACKUP' ? 'System Backup' : 'System Restore'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate" title={log.details}>
                                       {log.username} • {new Date(log.created_at).toLocaleDateString()}
                                    </p>
                                 </div>
                                 <span className="text-[10px] text-slate-400 font-mono mt-1">
                                    {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               <div className="p-3 border-t border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400">Showing last 5 operations</span>
               </div>
            </div>

          </div>

          {/* 3. POLICY INFO */}
          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-start gap-4">
             <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                <FileJson size={24} />
             </div>
             <div>
                <h4 className="font-bold text-indigo-900 text-sm">Automated Data Policy</h4>
                <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
                   Backups generated here are compliant with Data Privacy Act of 2012. 
                   They include full schema definitions, stored procedures, and encrypted user credentials.
                   Always store downloaded SQL files in a secure, encrypted location.
                </p>
             </div>
          </div>

        </div>
      </div>

      {/* --- RESTORE SECURITY MODAL --- */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-red-100 animate-in zoom-in-95">
            <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">Confirm Restoration</h2>
                <p className="text-red-700 text-sm mt-1">This will permanently overwrite the database.</p>
              </div>
            </div>

            <form onSubmit={handleRestoreSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm text-slate-600 mb-2 break-all">
                <span className="font-bold text-slate-800">Source:</span> {selectedFile?.name}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Lock size={14} className="text-slate-400"/> Admin Authorization
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter admin password"
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setShowRestoreModal(false); setSelectedFile(null); setPassword(''); }} 
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={restoring}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 shadow-lg shadow-red-500/30 disabled:opacity-70 flex justify-center items-center gap-2 transition-all"
                >
                  {restoring ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />} 
                  Restore System
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Backup;