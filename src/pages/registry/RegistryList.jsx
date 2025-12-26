import { useEffect, useState } from 'react';

// COMPONENTS
import RecordForm from '../../components/registry/RecordForm';
import RecordTable from '../../components/registry/RecordTable';
import ViewRecordModal from '../../components/registry/ViewRecordModal';

// CONTEXTS
import { useAuth } from '../../context/AuthContext';
import { useRegions } from '../../context/RegionContext';
import { useRegistry } from '../../context/RegistryContext'; // <--- DB CONNECTION

const RegistryList = () => {
  const { user } = useAuth();
  const { regions } = useRegions();
  
  // CONSUME DATABASE ACTIONS
  const { records, addRecord, updateRecord, archiveRecord, restoreRecord, destroyRecord } = useRegistry();
  
  // VIEW STATES
  const [currentTab, setCurrentTab] = useState('Active'); 
  const [loading, setLoading] = useState(true); // Simulate load
  const [searchTerm, setSearchTerm] = useState('');
  
  // FILTER STATE
  const [selectedRegionFilter, setSelectedRegionFilter] = useState(
    user.role === 'Super Admin' ? 'All' : user.region
  );
  
  // MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // VIEW LOGIC: Filter Records for Display
  // This runs on the client side to sort/filter the raw data from Context
  const filteredRecords = records.filter(r => {
    // 1. Search Logic
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Security / Region Logic
    let matchesRegion = false;
    if (user.role === 'Super Admin') {
        matchesRegion = selectedRegionFilter === 'All' ? true : r.region === selectedRegionFilter;
    } else {
        matchesRegion = r.region === user.region;
    }

    // 3. Tab Logic (Active vs Archived)
    const matchesTab = currentTab === 'Active' ? r.status !== 'Archived' : r.status === 'Archived';

    return matchesSearch && matchesRegion && matchesTab;
  });

  // Simulate network delay for realism
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // --- ACTIONS HANDLERS ---

  const handleSave = (data) => {
    if (editingRecord) {
        updateRecord(editingRecord.id, data); // Call Context
    } else {
        addRecord(data); // Call Context
    }
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleArchive = (id) => {
    if(window.confirm("Archive this record? It will move to restricted storage.")) {
        archiveRecord(id); // Call Context
    }
  };

  const handleRestore = (id) => {
    if(window.confirm("Restore this record to the active registry?")) {
        restoreRecord(id); // Call Context
    }
  };

  const handleDestroy = (id) => {
    if(window.confirm("WARNING: This will permanently delete the record. Proceed?")) {
        destroyRecord(id); // Call Context
    }
  };

  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const openViewModal = (record) => {
    setViewingRecord(record);
    setIsViewModalOpen(true);
  };

  const targetUploadRegion = user.role === 'Super Admin' 
    ? (selectedRegionFilter === 'All' ? 'Central Office' : selectedRegionFilter) 
    : user.region;

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col p-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {currentTab === 'Active' ? 'Document Registry' : 'Archived Records'}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
              user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
            }`}>
              {user.role === 'Super Admin' ? 'Global View' : user.region}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {user.role === 'Super Admin' ? 'Managing records across all regional offices.' : `Viewing restricted files for ${user.region} only.`}
          </p>
        </div>
        
        <div className="bg-gray-100 p-1 rounded-xl flex">
          <button onClick={() => setCurrentTab('Active')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'Active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>📂 Registry</button>
          <button onClick={() => setCurrentTab('Archived')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'Archived' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>📦 Archives</button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input type="text" placeholder="Search by ID or Title..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          {user.role === 'Super Admin' && (
            <div className="relative">
              <select 
                className="pl-3 pr-8 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                value={selectedRegionFilter}
                onChange={(e) => setSelectedRegionFilter(e.target.value)}
              >
                <option value="All">🌍 All Regions</option>
                {regions.map(r => (
                  <option key={r.id} value={r.name}>📂 {r.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {currentTab === 'Active' && (
          <button onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all flex items-center gap-2 text-sm font-medium"><span>+</span> New Record</button>
        )}
      </div>

      {/* TABLE */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
            {loading ? (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <RecordTable 
                    records={filteredRecords} 
                    onEdit={openEditModal} 
                    onArchive={handleArchive} 
                    onRestore={handleRestore}
                    onDestroy={handleDestroy}
                    onView={openViewModal}
                    viewMode={currentTab} 
                />
            )}
        </div>
      </div>

      {/* MODALS */}
      {isModalOpen && (
        <RecordForm 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
          initialData={editingRecord}
          targetRegion={targetUploadRegion} 
        />
      )}

      {isViewModalOpen && (
        <ViewRecordModal 
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          record={viewingRecord}
        />
      )}

    </div>
  );
};

export default RegistryList;