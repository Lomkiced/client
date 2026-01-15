import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCodex } from '../../context/CodexContext';
import { useRegions } from '../../context/RegionContext';

// --- ICONS ---
const Icons = {
  Folder: () => <svg className="w-16 h-16 text-amber-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>,
  FolderOpen: () => <svg className="w-16 h-16 text-amber-400 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" /></svg>,
  FileRule: () => <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Globe: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  MapPin: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Lock: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
};

const Codex = () => {
  const { user } = useAuth();
  const { regions } = useRegions();
  const { categories, types, addCategory, deleteCategory, addType, deleteType } = useCodex();

  // NAVIGATION STATE
  const [activeFolder, setActiveFolder] = useState(null);

  // MODAL STATES
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORMS
  const [catForm, setCatForm] = useState({ name: '', region: 'Global' });
  const [ruleForm, setRuleForm] = useState({
    type_name: '',
    retention_value: '',
    retention_unit: 'Years' // Default unit
  });

  const currentRules = activeFolder
    ? types.filter(t => t.category_id === activeFolder.category_id)
    : [];

  // --- PERMISSION CHECK ---
  // Allow if Super Admin OR Regional Admin (Role name usually 'REGIONAL_ADMIN' or 'ADMIN')
  const canEdit = user.role === 'SUPER_ADMIN' || user.role === 'REGIONAL_ADMIN' || user.role === 'ADMIN';
  const isSuperAdmin = user.role === 'SUPER_ADMIN';

  // Helper: Get Name of Current User's Region
  const getUserRegionName = () => {
    const regionObj = regions.find(r => r.id == user.region_id);
    return regionObj ? regionObj.name : '';
  };

  // --- HANDLERS ---

  const handleCreate = () => {
    if (activeFolder) {
      // Create Rule inside a folder
      setRuleForm({ type_name: '', retention_value: '', retention_unit: 'Years' });
      setIsRuleModalOpen(true);
    } else {
      // Create Folder
      // SMART PRE-FILL: If Regional Admin, lock to their region
      if (isSuperAdmin) {
        setCatForm({ name: '', region: 'Global' });
      } else {
        setCatForm({ name: '', region: getUserRegionName() });
      }
      setIsCategoryModalOpen(true);
    }
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addCategory(catForm);
    setIsSubmitting(false);
    setIsCategoryModalOpen(false);
  };

  const submitRule = async (e) => {
    e.preventDefault();
    if (!activeFolder) return;

    setIsSubmitting(true);

    // Construct retention period string (e.g., "5 Years", "30 Days", "Permanent")
    const retentionPeriod = ruleForm.retention_unit === 'Permanent'
      ? 'Permanent'
      : `${ruleForm.retention_value} ${ruleForm.retention_unit}`;

    await addType({
      type_name: ruleForm.type_name,
      retention_period: retentionPeriod,
      category_id: activeFolder.category_id,
      region: activeFolder.region
    });
    setIsSubmitting(false);
    setIsRuleModalOpen(false);
  };

  return (
    <div className="p-8 h-[calc(100vh-2rem)] flex flex-col bg-slate-50/50 animate-fade-in">

      {/* 1. HEADER & BREADCRUMBS */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-indigo-600">Codex</span>
            <span className="text-slate-300 font-light">/</span>
            <span className="text-slate-500 font-medium">Classification Rules</span>
          </h1>

          <div className="flex items-center gap-2 mt-3 text-sm font-medium">
            <button
              onClick={() => setActiveFolder(null)}
              className={`flex items-center gap-1 hover:text-indigo-600 transition-colors ${!activeFolder ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
            >
              <Icons.Home /> Root
            </button>
            {activeFolder && (
              <>
                <Icons.ChevronRight />
                <span className="text-indigo-600 font-bold px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100 flex items-center gap-2">
                  <Icons.FolderOpen className="w-4 h-4" />
                  {activeFolder.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button: Now visible to Regional Admins too */}
        {canEdit && (
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-300 font-bold text-sm flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Icons.Plus />
            {activeFolder ? 'New Document Rule' : 'New Classification Folder'}
          </button>
        )}
      </div>

      {/* 2. EXPLORER VIEW PORT */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto">

        {/* VIEW A: ROOT (FOLDERS) */}
        {!activeFolder && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.category_id}
                onClick={() => setActiveFolder(cat)}
                className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-100 p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-4 transition-transform group-hover:scale-110 duration-300">
                  <Icons.Folder />
                </div>
                <h3 className="font-bold text-slate-700 text-lg group-hover:text-indigo-700 transition-colors mb-1">{cat.name}</h3>

                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-2 ${cat.region === 'Global' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  {cat.region === 'Global' ? <Icons.Globe /> : <Icons.MapPin />}
                  {cat.region}
                </div>

                {/* Delete: Only Super Admin OR Owner of that region folder */}
                {(isSuperAdmin || (canEdit && cat.region === getUserRegionName())) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.category_id); }}
                    className="absolute top-3 right-3 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete Folder"
                  >
                    <Icons.Trash />
                  </button>
                )}
              </div>
            ))}

            {categories.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
                <div className="opacity-50 grayscale mb-4"><Icons.Folder /></div>
                <p>No classifications yet. Click "New Classification Folder" to start.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW B: INSIDE FOLDER (RULES) */}
        {activeFolder && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentRules.map((rule) => (
                <div key={rule.type_id} className="relative group bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-5 flex items-start gap-4 hover:shadow-lg transition-all">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Icons.FileRule />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{rule.type_name}</h4>
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-md">
                      <Icons.Clock />
                      Retention: <span className="text-slate-700">{rule.retention_period}</span>
                    </div>
                  </div>
                  {(isSuperAdmin || (canEdit && activeFolder.region === getUserRegionName())) && (
                    <button
                      onClick={() => deleteType(rule.type_id)}
                      className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icons.Trash />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Rule Button: Only if user has rights to this folder's region */}
              {(isSuperAdmin || (canEdit && activeFolder.region === getUserRegionName())) && (
                <button
                  onClick={handleCreate}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 transition-all gap-2 h-full min-h-[120px]"
                >
                  <Icons.Plus />
                  <span className="font-bold text-sm">Add New Rule</span>
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL: NEW FOLDER --- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-zoom-in">
            <div className="flex justify-center mb-4 text-amber-400"><Icons.Folder /></div>
            <h3 className="font-bold text-xl text-center text-slate-800 mb-6">Create Classification</h3>
            <form onSubmit={submitCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Folder Name</label>
                <input className="w-full border border-slate-300 p-3 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700" placeholder="e.g. Administrative" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Applicable Region
                  {!isSuperAdmin && <span className="text-[10px] text-indigo-600 flex items-center gap-1"><Icons.Lock /> Locked</span>}
                </label>

                {isSuperAdmin ? (
                  <select className="w-full border border-slate-300 p-3 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none bg-white cursor-pointer" value={catForm.region} onChange={e => setCatForm({ ...catForm, region: e.target.value })}>
                    <option value="Global">Global (All Regions)</option>
                    {regions.map(r => <option key={r.id} value={r.name}>{r.name} Only</option>)}
                  </select>
                ) : (
                  // LOCKED INPUT FOR REGIONAL ADMIN
                  <div className="relative mt-1">
                    <input
                      className="w-full border border-slate-200 bg-slate-100 p-3 rounded-xl text-sm text-slate-500 font-bold outline-none cursor-not-allowed"
                      value={catForm.region}
                      readOnly
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"><Icons.MapPin /></div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-200 disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Create Folder'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: NEW RULE --- */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-zoom-in">
            <div className="flex justify-center mb-4 text-indigo-500"><Icons.FileRule /></div>
            <h3 className="font-bold text-xl text-center text-slate-800 mb-1">Define New Rule</h3>
            <p className="text-center text-slate-500 text-sm mb-6">Inside: <span className="font-bold text-indigo-600">{activeFolder?.name}</span></p>

            <form onSubmit={submitRule} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Type Title</label>
                <input className="w-full border border-slate-300 p-3 rounded-xl text-sm mt-1 focus:ring-2 focus:ring-indigo-500 outline-none font-bold" placeholder="e.g. Purchase Request" value={ruleForm.type_name} onChange={e => setRuleForm({ ...ruleForm, type_name: e.target.value })} required autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retention Period</label>
                <div className="flex gap-2 mt-1">
                  {/* Number Input - Hidden when Permanent */}
                  {ruleForm.retention_unit !== 'Permanent' && (
                    <input
                      type="number"
                      min="1"
                      className="w-24 border border-slate-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-center"
                      placeholder="5"
                      value={ruleForm.retention_value}
                      onChange={e => setRuleForm({ ...ruleForm, retention_value: e.target.value })}
                      required={ruleForm.retention_unit !== 'Permanent'}
                    />
                  )}

                  {/* Unit Selector */}
                  <select
                    className="flex-1 border border-slate-300 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
                    value={ruleForm.retention_unit}
                    onChange={e => setRuleForm({
                      ...ruleForm,
                      retention_unit: e.target.value,
                      retention_value: e.target.value === 'Permanent' ? '' : ruleForm.retention_value
                    })}
                  >
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Months">Months</option>
                    <option value="Years">Years</option>
                    <option value="Permanent">♾️ Permanent</option>
                  </select>
                </div>

                {/* Live Preview */}
                <div className="mt-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-medium text-indigo-700 flex items-center gap-2">
                  <Icons.Clock />
                  <span>
                    {ruleForm.retention_unit === 'Permanent'
                      ? 'This document type will be kept permanently.'
                      : ruleForm.retention_value
                        ? `Documents will be retained for ${ruleForm.retention_value} ${ruleForm.retention_unit.toLowerCase()}.`
                        : 'Enter a value to see the retention preview.'
                    }
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsRuleModalOpen(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-200 disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Rule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Codex;