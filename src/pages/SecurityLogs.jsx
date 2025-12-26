import {
  AlertTriangle,
  ChevronLeft, ChevronRight,
  FileSpreadsheet,
  Lock, RefreshCw, Search, ShieldAlert, Trash2, X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearLogs, getLogs } from '../services/api';

const SecurityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Maintenance Modal State
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [password, setPassword] = useState('');
  const [retentionOption, setRetentionOption] = useState('30'); // Default: 30 days
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters & Pagination
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  useEffect(() => {
    const timer = setTimeout(() => fetchLogs(), 500);
    return () => clearTimeout(timer);
  }, [filters, pagination.page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getLogs({
        page: pagination.page,
        limit: 15,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate
      });

      // ⚠️ FIX: Defensive check to prevent White Screen
      if (response && Array.isArray(response.data)) {
        setLogs(response.data);
        setPagination(prev => ({ ...prev, ...response.pagination }));
      } else if (Array.isArray(response)) {
        setLogs(response); // Fallback for simple array
      } else {
        setLogs([]); // Safety net: Always ensure it's an array!
      }

    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogs([]); // Safety net on error
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenance = async (e) => {
    e.preventDefault();
    if (!password) return alert("Password is required for security.");
    
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      // retentionOption '0' means Clear All
      await clearLogs(password, parseInt(retentionOption));
      alert("System maintenance completed.");
      setShowMaintenance(false);
      setPassword('');
      fetchLogs(); // Refresh list
    } catch (err) {
      alert("Operation Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    const headers = ["ID,Timestamp,Actor,Action,Details,IP Address"];
    const rows = logs.map(log => 
      `"${log.log_id}","${new Date(log.created_at).toLocaleString()}","${log.username || 'System'}","${log.action}","${log.details}","${log.ip_address}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 relative">
      
      {/* HEADER */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" /> Security Audit Trail
            </h1>
            <p className="text-slate-500 text-sm mt-1">Immutable records of system activities.</p>
          </div>
          <div className="flex gap-2">
             {/* Maintenance Button */}
            <button onClick={() => setShowMaintenance(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors">
              <Trash2 size={16} /> Maintenance
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors">
              <FileSpreadsheet size={16} className="text-emerald-600" /> Export
            </button>
            <button onClick={() => fetchLogs()} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mt-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-3 items-center">
          <div className="flex-1 relative min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={filters.search}
              onChange={e => setFilters({...filters, search: e.target.value})}
            />
          </div>
          {/* Date Range Inputs would go here (same as previous code) */}
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="flex-1 overflow-auto px-8 pb-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Timestamp</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Actor</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Details</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">IP Addr</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                 // ... (Keep your skeleton loader here) ...
                 [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4 bg-slate-50" colSpan="5"><div className="h-8 bg-slate-200 rounded"></div></td>
                  </tr>
                ))
              ) : !Array.isArray(logs) || logs.length === 0 ? (
                // ⚠️ FIX: Explicit check for array type and length
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500">
                    <Filter className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    No logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  // ⚠️ FIX: Fallback key if log_id is missing
                  <tr key={log?.log_id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-slate-500 text-xs font-mono">
                      {log?.created_at ? new Date(log.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs border border-indigo-200">
                          {log?.username ? log.username[0].toUpperCase() : '?'}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{log?.username || 'System'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <ActionBadge action={log?.action || 'UNKNOWN'} />
                    </td>
                    <td className="p-4 text-sm text-slate-600 max-w-md truncate" title={log?.details}>
                      {log?.details || '-'}
                    </td>
                    <td className="p-4 text-xs text-slate-400 font-mono">
                      {log?.ip_address || '::1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="px-8 py-4 border-t border-slate-200 bg-white flex justify-between items-center">
         <span className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages}</span>
         <div className="flex gap-2">
            <button disabled={pagination.page===1} onClick={()=>setPagination(p=>({...p, page: p.page-1}))} className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <button disabled={pagination.page===pagination.totalPages} onClick={()=>setPagination(p=>({...p, page: p.page+1}))} className="p-2 border rounded hover:bg-slate-50 disabled:opacity-50"><ChevronRight size={16}/></button>
         </div>
      </div>

      {/* --- MAINTENANCE MODAL --- */}
      {showMaintenance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-900">Log Maintenance</h2>
                <p className="text-red-700 text-sm mt-1">Manage storage by pruning old records.</p>
              </div>
              <button onClick={() => setShowMaintenance(false)} className="ml-auto text-red-400 hover:text-red-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleMaintenance} className="p-6 space-y-4">
              
              {/* Option Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Maintenance Action</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  value={retentionOption}
                  onChange={(e) => setRetentionOption(e.target.value)}
                >
                  <option value="30">Clear logs older than 30 days (Recommended)</option>
                  <option value="90">Clear logs older than 90 days</option>
                  <option value="365">Clear logs older than 1 year</option>
                  <option value="0">⚠️ PURGE ALL LOGS (Nuclear Option)</option>
                </select>
              </div>

              {/* Security Confirmation */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Lock size={14} className="text-slate-400"/> Confirm Password
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter your password to authorize"
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-slate-500">This action will be audited.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowMaintenance(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
                <button 
                  type="submit" 
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 shadow-md shadow-red-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
                  {retentionOption === '0' ? 'Purge Everything' : 'Run Cleanup'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const ActionBadge = ({ action }) => {
  let styles = "bg-slate-100 text-slate-600 border-slate-200";
  const a = action ? action.toUpperCase() : "";
  if (a.includes("LOGIN")) styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (a.includes("MAINTENANCE") || a.includes("DELETE")) styles = "bg-red-50 text-red-700 border-red-200";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${styles}`}>{action}</span>;
};

export default SecurityLogs;