import { useState } from 'react';
import { useRegions } from '../../context/RegionContext';

// --- ICONS ---
const Icons = {
  Map: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Check: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>,
  X: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
};

const RegionManager = () => {
  const { regions, addRegion, updateRegion, deleteRegion, toggleStatus } = useRegions();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ code: '', name: '', address: '', status: 'Active' });

  // Handlers
  const handleOpenModal = (region = null) => {
    if (region) {
      setEditingId(region.id);
      setFormData(region);
    } else {
      setEditingId(null);
      setFormData({ code: '', name: '', address: '', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateRegion(editingId, formData);
    } else {
      addRegion(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure? This will disable access for all users in this region.")) {
      deleteRegion(id);
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600"><Icons.Map /></span> Regional Governance
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage regional office access points and operational status.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gray-900 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 text-sm font-medium hover:scale-105 active:scale-95"
        >
          <Icons.Plus /> Register New Region
        </button>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-10">
        {regions.map((region) => (
          <div key={region.id} className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden">
            
            {/* Status Indicator Stripe */}
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${region.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>

            {/* Card Content */}
            <div className="pl-4">
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                  region.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {region.code}
                </div>
                
                {/* Action Buttons (Visible on Hover) */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                  <button onClick={() => handleOpenModal(region)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                    <Icons.Edit />
                  </button>
                  <button onClick={() => handleDelete(region.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Icons.Trash />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-1">{region.name}</h3>
              <p className="text-sm text-gray-500 mb-6 flex items-start gap-2">
                <span className="mt-0.5 opacity-50">📍</span> {region.address}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex -space-x-2">
                   {/* Fake User Avatars for visual effect */}
                   <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">A</div>
                   <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">S</div>
                   <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-400">+</div>
                </div>
                
                <button 
                  onClick={() => toggleStatus(region.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    region.status === 'Active' 
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {region.status === 'Active' ? (
                     <><Icons.Check /> Operational</>
                  ) : (
                     <><Icons.X /> Offline</>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? 'Edit Region' : 'Register New Region'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Enter regional office details below.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region Code</label>
                    <input 
                      required autoFocus
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="e.g. R2"
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="Active">Operational</option>
                      <option value="Inactive">Offline</option>
                    </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Region Name</label>
                <input 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. Cagayan Valley"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">HQ Address</label>
                <input 
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="City, Province"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RegionManager;