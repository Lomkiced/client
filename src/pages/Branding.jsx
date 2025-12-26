import {
   CheckCircle2, Image as ImageIcon, LayoutTemplate, Loader2,
   Lock, // Added
   Palette, Save,
   ScanLine, // Added
   UploadCloud,
   User // Added
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useBranding } from '../context/BrandingContext';
import { getSystemSettings, updateSystemSettings } from '../services/api';

const Branding = () => {
  const { refreshBranding } = useBranding();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [settings, setSettings] = useState({
    systemName: '', orgName: '', welcomeMsg: '', primaryColor: '#4f46e5'
  });

  // Preview State
  const [logoPreview, setLogoPreview] = useState(null);
  const [bgPreview, setBgPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);

  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSystemSettings();
        setSettings({
          systemName: data.system_name || 'DOST-RMS',
          orgName: data.org_name || 'Department of Science and Technology',
          welcomeMsg: data.welcome_msg || 'Sign in to access the system.',
          primaryColor: data.primary_color || '#4f46e5'
        });
        if (data.logo_url) setLogoPreview(`http://localhost:5000${data.logo_url}`);
        if (data.login_bg_url) setBgPreview(`http://localhost:5000${data.login_bg_url}`);
      } catch (err) { console.error("Failed to load settings"); } 
      finally { setLoading(false); }
    };
    loadSettings();
  }, []);

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('systemName', settings.systemName);
      formData.append('orgName', settings.orgName);
      formData.append('welcomeMsg', settings.welcomeMsg);
      formData.append('primaryColor', settings.primaryColor);
      
      if (logoFile) formData.append('logo', logoFile);
      if (bgFile) formData.append('loginBg', bgFile);

      await updateSystemSettings(formData);
      await refreshBranding(); // Hot Reload
      setShowSuccess(true);
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading Studio...</div>;

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50 relative">
      
      {/* HEADER */}
      <div className="p-8 pb-4 flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Palette className="text-indigo-600" /> Identity Studio
          </h1>
          <p className="text-slate-500 text-sm mt-1">Configure the visual interface and login experience.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-sm shadow-indigo-200 transition-all active:scale-95"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 overflow-auto px-8 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
          
          {/* LEFT: CONTROLS */}
          <div className="space-y-6 max-w-3xl">
            
            {/* Identity Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <LayoutTemplate size={18} className="text-slate-400"/> System Identity
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase">System Name (Acronym)</label>
                     <input 
                        className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100" 
                        value={settings.systemName} 
                        onChange={(e) => setSettings({...settings, systemName: e.target.value})} 
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase">Organization Name</label>
                     <input 
                        className="w-full p-2.5 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100" 
                        value={settings.orgName} 
                        onChange={(e) => setSettings({...settings, orgName: e.target.value})} 
                     />
                  </div>
                  <div className="md:col-span-2 space-y-1">
                     <label className="text-xs font-bold text-slate-500 uppercase">Welcome Message</label>
                     <textarea 
                        rows="2" 
                        className="w-full p-3 border rounded-lg text-sm bg-slate-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100 resize-none" 
                        value={settings.welcomeMsg} 
                        onChange={(e) => setSettings({...settings, welcomeMsg: e.target.value})} 
                     />
                  </div>
               </div>
            </div>

            {/* Assets Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <ImageIcon size={18} className="text-slate-400"/> Visual Assets
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  {/* Logo Upload */}
                  <div onClick={() => logoInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 hover:border-indigo-300 transition-all group h-48">
                     {logoPreview ? (
                        <div className="h-20 w-full flex items-center justify-center mb-3">
                           <img src={logoPreview} className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                        </div>
                     ) : (
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors">
                           <UploadCloud size={20} />
                        </div>
                     )}
                     <span className="text-xs font-bold text-slate-700">System Logo</span>
                     <span className="text-[10px] text-slate-400 mt-1">Click to browse</span>
                     <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile, setLogoPreview)} />
                  </div>

                  {/* Background Upload */}
                  <div onClick={() => bgInputRef.current.click()} className="border-2 border-dashed border-slate-200 rounded-xl p-0 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-300 transition-all group h-48 relative overflow-hidden">
                     {bgPreview ? (
                        <>
                           <img src={bgPreview} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Change Image</span>
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center p-6">
                           <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-3">
                              <ImageIcon size={20} />
                           </div>
                           <span className="text-xs font-bold text-slate-700">Login Background</span>
                           <span className="text-[10px] text-slate-400 mt-1">1920x1080px</span>
                        </div>
                     )}
                     <input type="file" ref={bgInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, setBgFile, setBgPreview)} />
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW (MATCHES PROFESSIONAL LOGIN.JSX) */}
          <div className="flex flex-col h-full min-h-[500px]">
             <div className="mb-3 flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">Active View</span>
             </div>
             
             {/* THE SIMULATOR CONTAINER */}
             <div className="flex-1 rounded-2xl overflow-hidden relative shadow-2xl border border-slate-200 bg-slate-950 flex items-center justify-center">
                
                {/* 1. Aurora Background Simulator */}
                <div className="absolute inset-0 opacity-50 pointer-events-none">
                    {bgPreview && <img src={bgPreview} className="w-full h-full object-cover opacity-30 grayscale mix-blend-overlay" />}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-black opacity-90"></div>
                    {/* Simulated Orbs */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-600/20 rounded-full blur-[60px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                {/* 2. Glass Card Simulator (Matches New Login Structure) */}
                <div className="relative z-10 w-[320px] bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl ring-1 ring-white/5">
                   
                   {/* Logo Area */}
                   <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl mb-3 border border-white/10 shadow-lg">
                         {logoPreview ? (
                            <img src={logoPreview} className="h-7 w-auto" />
                         ) : (
                            <span className="text-xl font-bold text-white">{settings.systemName.charAt(0)}</span>
                         )}
                      </div>
                      <h2 className="text-lg font-bold text-white leading-tight">{settings.systemName || 'SYSTEM'}</h2>
                      <div className="flex items-center justify-center gap-2 opacity-60 mt-1">
                         <div className="h-px w-4 bg-gradient-to-r from-transparent to-slate-400"></div>
                         <p className="text-[8px] text-slate-400 uppercase tracking-[0.2em] font-bold">{settings.orgName || 'ORG'}</p>
                         <div className="h-px w-4 bg-gradient-to-l from-transparent to-slate-400"></div>
                      </div>
                   </div>

                   {/* Mock Inputs (Professional Style) */}
                   <div className="space-y-4 pointer-events-none select-none">
                      
                      {/* Username */}
                      <div className="group relative opacity-80">
                         <User className="absolute left-4 top-3 text-slate-500" size={16} />
                         <div className="w-full bg-slate-950/60 border border-slate-700/60 text-slate-500 pl-12 pr-4 py-3 rounded-xl text-xs font-medium flex items-center">
                           Identity ID / Username
                         </div>
                      </div>

                      {/* Password */}
                      <div className="group relative opacity-80">
                         <Lock className="absolute left-4 top-3 text-slate-500" size={16} />
                         <div className="w-full bg-slate-950/60 border border-slate-700/60 text-slate-500 pl-12 pr-4 py-3 rounded-xl text-xs font-medium flex items-center">
                           Secure Access Key
                         </div>
                      </div>

                      {/* Button */}
                      <div className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl mt-4 shadow-lg shadow-cyan-900/40 flex items-center justify-center gap-2 border-t border-white/10">
                         <span className="text-white font-bold text-xs">Authenticate</span>
                         <ScanLine size={14} className="text-white/70" />
                      </div>
                   </div>

                   {/* Footer */}
                   <div className="mt-6 text-center border-t border-white/5 pt-4">
                       <p className="text-[10px] text-slate-500 font-medium mb-1">New User Registration</p>
                   </div>
                </div>

                <div className="absolute bottom-4 flex items-center gap-2 opacity-40">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[8px] text-slate-400 font-mono tracking-widest">SYSTEM PREVIEW • LIVE</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center border border-slate-200 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={32} strokeWidth={3} />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Live Update Complete</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Your new branding is live across the enterprise system. No restart required.
            </p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              Return to Studio
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Branding;