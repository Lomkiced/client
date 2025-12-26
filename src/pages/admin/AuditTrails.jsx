import { useState } from 'react';

// 1. Realistic Security Mock Data
const MOCK_LOGS = [
  { id: 'LOG-9921', action: 'Failed Login Attempt', user: 'unknown_ip', ip: '112.198.2.1 (Manila)', time: '2 mins ago', severity: 'Critical', module: 'Auth' },
  { id: 'LOG-9920', action: 'Document Deleted', user: 'r.lim@dost.gov.ph', ip: '192.168.1.45', time: '10 mins ago', severity: 'High', module: 'Registry' },
  { id: 'LOG-9919', action: 'User Role Changed', user: 'm.santos@dost.gov.ph', ip: '192.168.1.10', time: '1 hour ago', severity: 'Warning', module: 'Admin' },
  { id: 'LOG-9918', action: 'System Backup', user: 'System Auto', ip: 'localhost', time: '5 hours ago', severity: 'Info', module: 'Database' },
  { id: 'LOG-9917', action: 'Report Exported', user: 'j.garcia@dost.gov.ph', ip: '192.168.1.12', time: '1 day ago', severity: 'Info', module: 'Reports' },
];

const AuditTrails = () => {
  const [filter, setFilter] = useState('All');

  // 2. Logic to filter logs by Severity
  const filteredLogs = filter === 'All' 
    ? MOCK_LOGS 
    : MOCK_LOGS.filter(log => log.severity === filter);

  // 3. Helper for Visual "Threat Level"
  const getSeverityBadge = (level) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200 animate-pulse'; // Pulsing effect for critical
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="p-6">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          Security Audit Trails
          <span className="text-xs font-normal bg-gray-100 px-2 py-1 rounded text-gray-500 border">Super Admin Access Only</span>
        </h1>
        <p className="text-gray-500 mt-1">Monitor system integrity, access logs, and potential security threats.</p>
      </div>

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by IP, User, or Event ID..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Severity Filter Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg">
          {['All', 'Critical', 'High', 'Info'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                filter === tab 
                  ? 'bg-white text-gray-800 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* Export Button */}
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <span>📥</span> Export Logs
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-gray-100 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Event ID</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Action & Module</th>
              <th className="px-6 py-4">User / IP Address</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-400 text-xs">{log.id}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${getSeverityBadge(log.severity)}`}>
                    {log.severity.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{log.action}</p>
                  <p className="text-xs text-gray-400">Module: {log.module}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-gray-700">{log.user}</p>
                  <p className="text-xs font-mono text-gray-400">{log.ip}</p>
                </td>
                <td className="px-6 py-4 text-gray-500">{log.time}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:underline">View Raw</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrails;