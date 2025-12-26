import { useMemo, useState } from 'react';
import { useRegions } from '../../context/RegionContext'; // <--- CONNECTED TO BRAIN

// --- ICONS ---
const Icons = {
  Server: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  Activity: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Wifi: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" /></svg>,
  MapPin: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
};

// --- PRE-DEFINED COORDINATE SLOTS FOR NODES ---
// This ensures dynamic regions appear in nice spots on the map
const COORDINATE_SLOTS = [
  { top: '20%', left: '20%' }, // Slot 1
  { top: '30%', left: '50%' }, // Slot 2
  { top: '60%', left: '30%' }, // Slot 3
  { top: '50%', left: '70%' }, // Slot 4
  { top: '20%', left: '70%' }, // Slot 5
  { top: '70%', left: '50%' }, // Slot 6
  { top: '40%', left: '10%' }, // Slot 7
  { top: '80%', left: '80%' }, // Slot 8
];

const GlobalMap = () => {
  const { regions } = useRegions(); // <--- GET LIVE REGIONS
  const [activeRegionId, setActiveRegionId] = useState(null);

  // Combine Real Data with Visual Metadata
  const mapNodes = useMemo(() => {
    return regions.map((region, index) => {
      // Assign a coordinate slot based on index (loop if too many regions)
      const slot = COORDINATE_SLOTS[index % COORDINATE_SLOTS.length];
      
      // Determine visual status
      const isOnline = region.status === 'Active';
      
      return {
        ...region,
        ...slot,
        color: isOnline ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50',
        pulse: isOnline ? 'animate-ping' : '',
        connectionQuality: isOnline ? 'Optimal' : 'Offline',
        // Mock data for the "Intelligence" panel since we only have basic region info
        stats: {
          uploads: Math.floor(Math.random() * 500) + 120,
          latency: isOnline ? `${Math.floor(Math.random() * 40) + 10}ms` : '---',
          storage: `${Math.floor(Math.random() * 80) + 10}% Used`
        }
      };
    });
  }, [regions]);

  const activeNode = activeRegionId ? mapNodes.find(n => n.id === activeRegionId) : null;

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Regional Command Center</h1>
          <p className="text-gray-500 text-sm">Real-time geospatial visualization of DOST regional nodes.</p>
        </div>
        <div className="flex gap-4 text-xs font-medium uppercase tracking-wider">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span> Online</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span> Offline</div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT: The Map Visualization (Digital Topology) */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl relative overflow-hidden shadow-2xl border border-slate-800 p-8 flex items-center justify-center">
          
          {/* 1. Cyberpunk Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }}>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

          {/* 2. Network Mesh (SVG Lines connecting Center to Nodes) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {mapNodes.map((node, i) => (
              <line 
                key={`link-${i}`}
                x1="50%" y1="50%" // Center of map
                x2={node.left} y2={node.top} 
                stroke={node.status === 'Active' ? '#10b981' : '#ef4444'} 
                strokeWidth="1" 
                strokeDasharray="4,4"
              />
            ))}
            {/* Center Hub */}
            <circle cx="50%" cy="50%" r="4" fill="white" opacity="0.5" />
          </svg>

          {/* 3. Interactive Nodes */}
          <div className="absolute inset-0 w-full h-full">
            {mapNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setActiveRegionId(node.id)}
                style={{ top: node.top, left: node.left }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              >
                {/* Ping Ring */}
                {node.status === 'Active' && (
                  <div className={`absolute -inset-6 rounded-full opacity-20 ${node.pulse} ${node.color}`}></div>
                )}
                
                {/* Core Node */}
                <div className={`relative w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg ${node.color} group-hover:scale-150 transition-all duration-300 z-10`}></div>

                {/* Hover Label */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  {node.code}
                </div>
              </button>
            ))}
          </div>

          {/* System Footer */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between text-slate-500 text-[10px] font-mono uppercase tracking-widest">
            <span>DOST-RMS NET_V2.0</span>
            <span>NODES_DETECTED: {mapNodes.length}</span>
            <span className="animate-pulse text-emerald-500">SYSTEM_OPTIMAL</span>
          </div>
        </div>

        {/* RIGHT: Data Intelligence Sidebar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative">
          
          {activeNode ? (
            <div className="flex-1 flex flex-col animate-fade-in">
              {/* Region Header */}
              <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Selected Node</span>
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase border ${activeNode.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeNode.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {activeNode.status === 'Active' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 leading-tight">{activeNode.name}</h2>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Icons.MapPin /> {activeNode.address}
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="p-6 grid grid-cols-2 gap-4 border-b border-gray-100">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 mb-1"><Icons.Activity /> <span className="text-[10px] font-bold uppercase">Uploads</span></div>
                  <span className="text-lg font-bold text-gray-800">{activeNode.stats.uploads}</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 text-purple-600 mb-1"><Icons.Wifi /> <span className="text-[10px] font-bold uppercase">Latency</span></div>
                  <span className="text-lg font-bold text-gray-800">{activeNode.stats.latency}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2">
                  <div className="flex items-center gap-2 text-amber-600 mb-1"><Icons.Server /> <span className="text-[10px] font-bold uppercase">Cloud Storage</span></div>
                  <div className="w-full bg-white h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: activeNode.stats.storage.split('%')[0] + '%' }}></div>
                  </div>
                  <div className="text-right text-[10px] font-bold text-amber-700 mt-1">{activeNode.stats.storage}</div>
                </div>
              </div>

              {/* Log Feed */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Live Transmission Log</h3>
                <ul className="space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <li key={i} className="flex gap-3 items-start p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5"></div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Encrypted Packet Received</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {activeNode.code}-8X{i}9 • {i * 15 + 2}m ago</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={() => setActiveRegionId(null)}
                  className="w-full py-2.5 text-xs font-bold text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-lg transition-all uppercase tracking-wide"
                >
                  Close Data Stream
                </button>
              </div>
            </div>
          ) : (
            // Idle State
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-50 animate-ping opacity-75"></div>
                <div className="text-4xl animate-pulse">🌍</div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Awaiting Selection</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-[200px] leading-relaxed">
                Select a <span className="font-bold text-indigo-600">Regional Node</span> from the topology map to view real-time telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalMap;