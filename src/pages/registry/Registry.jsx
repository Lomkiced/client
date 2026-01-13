import { useEffect, useState } from 'react';
import DocumentViewerModal from '../../components/registry/DocumentViewerModal';
import FilePasswordModal from '../../components/registry/FilePasswordModal';
import RecordModal from '../../components/registry/RecordModal';
import RecordTable from '../../components/registry/RecordTable';
import { useAuth } from '../../context/AuthContext';
import { useCodex } from '../../context/CodexContext';
import { useRegions } from '../../context/RegionContext';
import { useRegistry } from '../../context/RegistryContext';

const Icons = {
  RegionFolder: () => <svg className="w-24 h-24 text-blue-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>,
  CodexFolder: () => <svg className="w-20 h-20 text-amber-400 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>,
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
};

const Registry = () => {
  const { user } = useAuth();
  const { records, pagination, fetchRecords, destroyRecord, archiveRecord, restoreRecord, loading } = useRegistry();
  const { categories } = useCodex();
  const { regions } = useRegions();
  
  const [activeRegion, setActiveRegion] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [viewMode, setViewMode] = useState('Active');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedRestrictedRecord, setSelectedRestrictedRecord] = useState(null);
  
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [viewerFile, setViewerFile] = useState(null);

  // SEARCH EFFECT
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        fetchRecords({ 
            region: activeRegion ? activeRegion.id : '', 
            category: activeCategory ? activeCategory.name : 'All', 
            page: 1, 
            status: viewMode,
            search: searchTerm 
        });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeRegion, activeCategory, viewMode]);

  const enterRegion = (region) => { setActiveRegion(region); setActiveCategory(null); setSearchTerm(''); };
  const enterCategory = (category) => {
    if (!activeRegion) return; 
    setActiveCategory(category);
    setViewMode('Active');
    setSearchTerm(''); 
  };

  const goToRoot = () => { setActiveRegion(null); setActiveCategory(null); setSearchTerm(''); };
  const goToRegion = () => { setActiveCategory(null); setSearchTerm(''); };

  const visibleRegions = regions.filter(region => {
    const isSuperAdmin = user?.role === 'SUPER_ADMIN';
    const isAssigned = region.id == user?.region_id; 
    return (isSuperAdmin || isAssigned);
  });

  const getVisibleCategories = () => {
    if (!activeRegion) return [];
    return categories.filter(cat => cat.region === 'Global' || cat.region === activeRegion.name);
  };

  const toggleViewMode = (mode) => { setViewMode(mode); };

  const handleArchive = async (id) => {
    if (window.confirm("Are you sure you want to archive this record?")) {
        await archiveRecord(id);
        // Refresh Current View
        fetchRecords({ region: activeRegion?.id, category: activeCategory?.name, page: 1, status: viewMode, search: searchTerm });
    }
  };

  const handleEdit = (rec) => { setRecordToEdit(rec); setIsModalOpen(true); };
  
  const handleOperationSuccess = () => {
    setIsModalOpen(false);
    setRecordToEdit(null);
    fetchRecords({ region: activeRegion?.id, category: activeCategory?.name, page: 1, status: viewMode, search: searchTerm });
  };

  const handleViewFile = (record) => {
    if (record.is_restricted) {
        setSelectedRestrictedRecord(record);
        setPasswordModalOpen(true);
    } else {
        const url = `http://localhost:5000/api/records/download/${record.file_path}`;
        setViewerUrl(url);
        setViewerFile(record);
        setViewerOpen(true);
    }
  };

  const handleUnlockSuccess = (filePath, accessToken) => {
    const url = `http://localhost:5000/api/records/download/${filePath}?token=${accessToken}`;
    setViewerUrl(url);
    setViewerFile(selectedRestrictedRecord);
    setViewerOpen(true);
  };

  // Logic to show table vs folders
  const showTable = (activeRegion && activeCategory) || searchTerm.length > 0;

  return (
    <div className="p-8 min-h-screen bg-slate-50/50 animate-fade-in flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3"><span className="text-indigo-600">Registry</span></h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-medium">
             <button onClick={goToRoot} className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${!activeRegion ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}><Icons.Home /> National</button>
             {activeRegion && (
               <>
                 <Icons.ChevronRight />
                 <button onClick={goToRegion} className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${!activeCategory ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>{activeRegion.name}</button>
               </>
             )}
             {activeCategory && <><Icons.ChevronRight /><span className="text-indigo-600 font-bold px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">{activeCategory.name}</span></>}
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 font-bold text-sm flex items-center gap-2 active:scale-95 transition-all"><Icons.Plus /> Upload Record</button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="relative w-full max-w-md">
           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.Search /></div>
           <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
         </div>
         <div className="flex bg-slate-100 p-1 rounded-lg">
            <button onClick={() => toggleViewMode('Active')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'Active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Active</button>
            <button onClick={() => toggleViewMode('Archived')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'Archived' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'}`}>Archived</button>
         </div>
      </div>

      {/* REGION SELECTION */}
      {!activeRegion && !searchTerm && (
        <div className="animate-fade-in-up">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Regional Vaults</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {visibleRegions.map((region) => (
                    <div key={region.id} onClick={() => enterRegion(region)} className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-xl group">
                        <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110 mb-4"><Icons.RegionFolder /></div>
                        <h3 className="font-bold text-slate-700 text-lg">{region.name}</h3>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* CATEGORY SELECTION */}
      {activeRegion && !activeCategory && !searchTerm && (
        <div className="animate-fade-in-up">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Classification Folders</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {getVisibleCategories().map((cat) => (
                    <div key={cat.category_id} onClick={() => enterCategory(cat)} className="bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-200 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all shadow-sm hover:shadow-xl group">
                        <div className="transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110 mb-4"><Icons.CodexFolder /></div>
                        <h3 className="font-bold text-slate-700 text-lg">{cat.name}</h3>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* DATA TABLE */}
      {showTable && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col animate-fade-in">
          <div className="overflow-x-auto flex-1">
            <RecordTable records={records} viewMode={viewMode} onEdit={handleEdit} onArchive={handleArchive} onRestore={restoreRecord} onDestroy={destroyRecord} onView={handleViewFile} />
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
            <div className="text-xs text-slate-500">Page {pagination.current} of {pagination.pages}</div>
            <div className="flex gap-2">
              <button disabled={pagination.current === 1} onClick={() => fetchRecords({ page: pagination.current - 1, region: activeRegion?.id, category: activeCategory?.name, status: viewMode, search: searchTerm })} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50">Prev</button>
              <button disabled={pagination.current === pagination.pages} onClick={() => fetchRecords({ page: pagination.current + 1, region: activeRegion?.id, category: activeCategory?.name, status: viewMode, search: searchTerm })} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <RecordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleOperationSuccess} recordToEdit={recordToEdit} />
      <FilePasswordModal isOpen={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} onSuccess={handleUnlockSuccess} record={selectedRestrictedRecord} />
      <DocumentViewerModal isOpen={viewerOpen} onClose={() => setViewerOpen(false)} fileUrl={viewerUrl} fileName={viewerFile?.title || 'Document'} isRestricted={viewerFile?.is_restricted} />
    </div>
  );
};

export default Registry;