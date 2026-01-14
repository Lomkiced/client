import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, records: 0, storage: 0, disposal_queue: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('dost_token');
            const res = await fetch('http://localhost:5000/api/dashboard/stats', { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                const data = await res.json();
                setStats({ ...data, disposal_queue: data.disposal_queue || [] });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getDisposalStatus = (date) => {
      const diff = new Date(date) - new Date();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days < 0) return { label: 'Action Required', color: 'text-red-600 bg-red-50 border-red-100' };
      return { label: `${days} Days Remaining`, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' };
  };

  if (loading) return <div className="p-8 text-slate-400 font-bold animate-pulse">Syncing Regional Data...</div>;

  return (
    <div className="p-8 min-h-screen bg-slate-50/50 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden"><div className="relative z-10"><div className="flex items-center gap-2 mb-2 opacity-80"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span><span className="text-xs font-bold uppercase tracking-widest">Regional Command</span></div><h1 className="text-3xl font-bold">{user.region} Dashboard</h1><p className="text-blue-100 mt-2 text-sm max-w-lg">Operational overview and document lifecycle management for your jurisdiction.</p></div></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Regional Staff</h3><p className="text-4xl font-black text-slate-800 mt-2">{stats.users}</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Records</h3><p className="text-4xl font-black text-indigo-600 mt-2">{stats.records}</p></div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Disposal Alert</h3><p className="text-4xl font-black text-amber-500 mt-2">{stats.disposal_queue?.length || 0}</p></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100"><h3 className="font-bold text-slate-800">Regional Disposal Schedule</h3><p className="text-xs text-slate-400 mt-1">Files approaching mandatory disposal date based on retention policy.</p></div>
        <div className="p-0">
            {!stats.disposal_queue || stats.disposal_queue.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-sm">No files currently scheduled for disposal.</div>
            ) : (
                <table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs"><tr><th className="px-6 py-3">File Name</th><th className="px-6 py-3">Disposal Date</th><th className="px-6 py-3 text-right">Status</th></tr></thead><tbody className="divide-y divide-slate-50">{stats.disposal_queue.map((rec) => { const status = getDisposalStatus(rec.disposal_date); return (<tr key={rec.record_id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 font-bold text-slate-700">{rec.title}</td><td className="px-6 py-4 text-slate-500 font-mono">{new Date(rec.disposal_date).toLocaleDateString()}</td><td className="px-6 py-4 text-right"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${status.color}`}>{status.label}</span></td></tr>);})}</tbody></table>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;