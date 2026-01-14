import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
const Icons = {
  Users: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Files: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Shield: () => <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Server: () => <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  Clock: () => <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0, records: 0, storage: 0,
    regions: { total: 0, active: 0 },
    recent_activity: [], disposal_queue: []
  });

  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('dost_token');
            const res = await fetch('http://localhost:5000/api/dashboard/stats', { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                // Ensure arrays exist to prevent crashes
                setStats({
                    ...data,
                    recent_activity: data.recent_activity || [],
                    disposal_queue: data.disposal_queue || []
                });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDisposalStatus = (date) => {
      const diff = new Date(date) - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days < 0) return { label: 'Expired', color: 'text-red-600 bg-red-50' };
      if (days < 30) return { label: `${days} Days Left`, color: 'text-amber-600 bg-amber-50' };
      return { label: 'Secure', color: 'text-emerald-600 bg-emerald-50' };
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-600 font-bold tracking-widest animate-pulse">LOADING METRICS...</div>;

  return (
    <div className="p-8 min-h-screen bg-slate-50/50 flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div><h1 className="text-4xl font-black text-slate-800 tracking-tight">Command Center</h1><p className="text-slate-500 font-medium">System-wide surveillance & governance.</p></div>
        <div className="text-right hidden md:block"><p className="text-3xl font-black text-slate-800 tabular-nums">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all"><div className="relative z-10 flex justify-between items-start"><div><p className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Personnel</p><h2 className="text-4xl font-bold">{stats.users}</h2></div><div className="p-3 bg-white/10 rounded-xl"><Icons.Users /></div></div></div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all"><div className="relative z-10 flex justify-between items-start"><div><p className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Records</p><h2 className="text-4xl font-bold">{stats.records}</h2></div><div className="p-3 bg-white/10 rounded-xl"><Icons.Files /></div></div></div>
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all"><div className="relative z-10 flex justify-between items-start"><div><p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Storage</p><h2 className="text-4xl font-bold">{formatBytes(stats.storage)}</h2></div><div className="p-3 bg-white/10 rounded-xl"><Icons.Server /></div></div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Icons.Clock /> Retention Monitor</h3><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upcoming Disposals</span></div>
            <div className="p-2">
                {!stats.disposal_queue || stats.disposal_queue.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No records scheduled for disposal.</div>
                ) : (
                    <table className="w-full text-left text-sm"><thead className="text-xs text-slate-400 font-bold uppercase bg-slate-50"><tr><th className="px-4 py-3">Record Title</th><th className="px-4 py-3">Retention</th><th className="px-4 py-3 text-right">Status</th></tr></thead><tbody className="divide-y divide-slate-50">{stats.disposal_queue.map((rec) => { const status = getDisposalStatus(rec.disposal_date); return (<tr key={rec.record_id} className="hover:bg-slate-50 transition-colors"><td className="px-4 py-3 font-bold text-slate-700">{rec.title}</td><td className="px-4 py-3 text-slate-500">{new Date(rec.disposal_date).toLocaleDateString()}</td><td className="px-4 py-3 text-right"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${status.color}`}>{status.label}</span></td></tr>);})}</tbody></table>
                )}
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-slate-100"><h3 className="font-bold text-slate-800 flex items-center gap-2"><Icons.Shield /> Security Feed</h3></div>
            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {stats.recent_activity?.map((log) => (
                    <div key={log.log_id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <p className="text-xs font-bold text-indigo-600 mb-0.5">{log.username}</p>
                        <p className="text-xs text-slate-600">{log.action}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;