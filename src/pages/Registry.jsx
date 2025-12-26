import { Archive, ChevronLeft, ChevronRight, FileText, Filter, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import RecordForm from '../components/RecordForm';
import RecordTable from '../components/RecordTable';
import { createRecord, getCategories, getRecords, updateRecord } from '../services/api';

const Registry = () => {
  // State
  const [currentTab, setCurrentTab] = useState('Active');
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // NEW: Track record being edited
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Load Categories on Mount
  useEffect(() => { getCategories().then(setCategories); }, []);

  // Fetch Data (Debounced)
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getRecords(searchTerm, page, selectedCategory, limit, currentTab);
      setRecords(result.data); 
      setTotalPages(result.totalPages);
      setTotalRecords(result.total);
    } catch (error) { console.error("Error loading records"); }
    setLoading(false);
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => { loadData(); }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, page, limit, currentTab]); 

  // Unified Save Handler (Create or Update)
  const handleSave = async (data) => {
    try {
      if (editingRecord) {
        // Update Logic
        await updateRecord(editingRecord.record_id, data);
      } else {
        // Create Logic
        await createRecord(data);
      }
      setIsModalOpen(false);
      setEditingRecord(null); // Clear edit state
      loadData(); 
    } catch (err) { alert("Failed to save."); }
  };

  // Open Modal for Editing
  const openEditModal = (record) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // Close Modal and Reset
  const handleClose = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 h-[calc(100vh-2rem)] flex flex-col">
      
      {/* 1. Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 shrink-0">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                {currentTab === 'Active' ? 'Document Registry' : 'Archived Records'}
            </h1>
            <p className="text-sm text-gray-500">
                {currentTab === 'Active' ? 'Active lifecycle management' : 'Restricted access storage'}
            </p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
            <button 
                onClick={() => { setCurrentTab('Active'); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'Active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <FileText size={16} /> Registry
            </button>
            <button 
                onClick={() => { setCurrentTab('Archived'); setPage(1); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'Archived' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Archive size={16} /> Archives
            </button>
        </div>
      </div>

      {/* 2. Controls Toolbar */}
      <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center justify-between shrink-0">
        
        {/* LEFT: Search */}
        <div className="relative w-full md:w-72 lg:w-96 order-2 md:order-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={currentTab === 'Active' ? "Search..." : "Search archives..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        {/* RIGHT: Filters & Action */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto order-1 md:order-2 justify-end">
            
            {/* Filter Dropdown */}
            <div className="relative min-w-[180px]">
                <Filter className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <select 
                    className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-gray-50 transition-colors appearance-none"
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                >
                    <option value="">All Types</option>
                    {categories.map(c => <option key={c.category_id} value={c.name}>{c.name}</option>)}
                </select>
            </div>

            {/* Pagination Limit */}
            <select 
                className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                value={limit}
                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
            >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
            </select>

            {/* Create Button */}
            {currentTab === 'Active' && (
                <button 
                    onClick={() => { setEditingRecord(null); setIsModalOpen(true); }} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 transition-all hover:-translate-y-0.5 whitespace-nowrap text-sm font-medium"
                >
                <Plus size={18} /> New
                </button>
            )}
        </div>
      </div>

      {/* 3. Table Area */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex-1 overflow-auto custom-scrollbar">
            {loading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            )}
            
            {/* Pass onEdit prop to Table */}
            <RecordTable 
                records={records} 
                viewMode={currentTab} 
                onRefresh={loadData} 
                onEdit={openEditModal} 
            />
        </div>

        {/* 4. Pagination Footer */}
        <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-500">
                <span className="font-bold text-gray-700">{records.length}</span> / <span className="font-bold text-gray-700">{totalRecords}</span> items
            </p>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 border bg-white rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-medium text-gray-700 px-2">Page {page} of {totalPages || 1}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0} className="p-1.5 border bg-white rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      </div>

      {/* Pass initialData to Form */}
      {isModalOpen && (
        <RecordForm 
            onClose={handleClose} 
            onSave={handleSave} 
            initialData={editingRecord}
        />
      )}
      
      {/* CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default Registry;