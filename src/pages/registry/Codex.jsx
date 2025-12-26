import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCodex } from '../../context/CodexContext'; // <--- CONNECTED
import { useRegions } from '../../context/RegionContext';

// ... (Keep your Icons object here as is) ...
const Icons = {
  Book: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Globe: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  MapPin: () => <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Edit: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>,
};

const Codex = () => {
  const { user } = useAuth();
  const { regions } = useRegions();
  
  // USE CONTEXT INSTEAD OF MOCK DATA
  const { categories, types, addCategory, deleteCategory, addType, deleteType } = useCodex();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState(
    user.role === 'Super Admin' ? 'All' : user.region
  );

  // Modal States
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: '', region: 'Global' });
  const [ruleForm, setRuleForm] = useState({ type_name: '', retention_period: '' });

  // 1. Filter Logic
  const getFilteredCategories = () => {
    return categories.filter(cat => {
      if (user.role === 'Super Admin') {
        if (selectedRegionFilter === 'All') return true;
        return cat.region === 'Global' || cat.region === selectedRegionFilter;
      }
      return cat.region === 'Global' || cat.region === user.region;
    });
  };

  const visibleCategories = getFilteredCategories();

  // Auto-select first category
  useEffect(() => {
    if (visibleCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(visibleCategories[0]);
    }
  }, [categories, selectedRegionFilter]);

  const activeTypes = selectedCategory 
    ? types.filter(t => t.category_id === selectedCategory.category_id)
    : [];

  // 2. Handlers
  const handleSaveCategory = (e) => {
    e.preventDefault();
    addCategory(catForm);
    setIsCategoryModalOpen(false);
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    addType({
      ...ruleForm,
      category_id: selectedCategory.category_id,
      region: selectedCategory.region // Rules inherit region from category
    });
    setRuleForm({ type_name: '', retention_period: '' });
    setIsRuleModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col md:flex-row gap-6 p-6 animate-fade-in">
      {/* LEFT PANE: SERIES */}
      <div className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="text-indigo-600"><Icons.Book /></span> NAP Series
            </h2>
            <p className="text-xs text-gray-500 mt-1">Classification Scheme</p>
          </div>
          {user.role === 'Super Admin' && (
            <button onClick={() => { setCatForm({name:'', region:'Global'}); setIsCategoryModalOpen(true); }} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"><Icons.Plus /></button>
          )}
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {visibleCategories.map(cat => (
            <div key={cat.category_id} className="group relative">
                <button
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex justify-between items-center pr-10
                    ${selectedCategory?.category_id === cat.category_id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'}`}
                >
                <div className="flex flex-col">
                    <span>{cat.name}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                        {cat.region === 'Global' ? <Icons.Globe /> : <Icons.MapPin />}
                        <span className={`text-[10px] uppercase tracking-wider ${selectedCategory?.category_id === cat.category_id ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {cat.region}
                        </span>
                    </div>
                </div>
                </button>
                {user.role === 'Super Admin' && (
                    <button onClick={(e) => { e.stopPropagation(); deleteCategory(cat.category_id); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Icons.Trash /></button>
                )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANE: RULES */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedCategory ? (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedCategory.name}</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide mt-1 inline-block ${selectedCategory.region === 'Global' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                    {selectedCategory.region === 'Global' ? 'Global Standard' : `${selectedCategory.region} Exclusive`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {user.role === 'Super Admin' && (
                    <select className="pl-3 pr-8 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-medium focus:outline-none cursor-pointer" value={selectedRegionFilter} onChange={(e) => setSelectedRegionFilter(e.target.value)}>
                        <option value="All">🌍 View All</option>
                        {regions.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                    </select>
                )}
                {user.role === 'Super Admin' && (
                    <button onClick={() => setIsRuleModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"><Icons.Plus /> Add Rule</button>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              <div className="grid gap-3">
                {activeTypes.length === 0 ? <div className="text-center py-20 text-gray-400 text-sm">No rules defined in this series yet.</div> : 
                  activeTypes.map(type => (
                    <div key={type.type_id} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Icons.Shield /></div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{type.type_name}</h4>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Icons.Clock /> {type.retention_period}</div>
                        </div>
                      </div>
                      {user.role === 'Super Admin' && <button onClick={() => deleteType(type.type_id)} className="text-gray-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"><Icons.Trash /></button>}
                    </div>
                  ))
                }
              </div>
            </div>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-gray-400">Select a Series</div>}
      </div>

      {/* --- MODALS --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                <h3 className="font-bold text-lg mb-4">New Series</h3>
                <form onSubmit={handleSaveCategory} className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Series Name" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} required />
                    <select className="w-full border p-2 rounded" value={catForm.region} onChange={e => setCatForm({...catForm, region: e.target.value})}>
                        <option value="Global">Global</option>
                        {regions.map(r => <option key={r.id} value={r.name}>{r.name} Only</option>)}
                    </select>
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsCategoryModalOpen(false)} className="text-gray-500">Cancel</button><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button></div>
                </form>
            </div>
        </div>
      )}
      
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                <h3 className="font-bold text-lg mb-4">Add Rule</h3>
                <form onSubmit={handleSaveRule} className="space-y-4">
                    <input className="w-full border p-2 rounded" placeholder="Document Type" value={ruleForm.type_name} onChange={e => setRuleForm({...ruleForm, type_name: e.target.value})} required />
                    <input className="w-full border p-2 rounded" placeholder="Retention Period" value={ruleForm.retention_period} onChange={e => setRuleForm({...ruleForm, retention_period: e.target.value})} required />
                    <div className="flex justify-end gap-2"><button type="button" onClick={() => setIsRuleModalOpen(false)} className="text-gray-500">Cancel</button><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button></div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Codex;