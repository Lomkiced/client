import { Image as ImageIcon, LayoutTemplate, Palette, RefreshCw, Save, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBranding } from '../../context/BrandingContext';

const SystemBranding = () => {
  const { branding, refreshBranding } = useBranding();
  
  // Local state for editing
  const [form, setForm] = useState(branding);
  const [logoFile, setLogoFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(branding.logoUrl);
  const [previewBg, setPreviewBg] = useState(branding.loginBgUrl);

  // Sync state when context loads
  useEffect(() => {
    setForm(branding);
    setPreviewLogo(branding.logoUrl);
    setPreviewBg(branding.loginBgUrl);
  }, [branding]);

  // Handle Text Changes
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle File Upload Previews
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit to Server
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append('system_name', form.systemName);
    formData.append('org_name', form.orgName);
    formData.append('welcome_msg', form.welcomeMsg);
    formData.append('primary_color', form.primaryColor);
    formData.append('secondary_color', form.secondaryColor);
    if (logoFile) formData.append('logo', logoFile);
    if (bgFile) formData.append('bg', bgFile);

    try {
        const token = localStorage.getItem('dost_token');
        await fetch('http://localhost:5000/api/settings', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });
        await refreshBranding(); // Update app instantly
        alert("System Branding Updated Successfully!");
    } catch (err) {
        alert("Failed to save changes.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Branding</h1>
            <p className="text-slate-500 font-medium">Customize the look and feel of the portal.</p>
        </div>
        <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
        >
            {saving ? <RefreshCw className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? 'Applying...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: EDITORS */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Identity Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutTemplate className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-800">System Identity</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">System Name (Acronym)</label>
                        <input name="systemName" value={form.systemName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Organization Name</label>
                        <input name="orgName" value={form.orgName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Login Welcome Message</label>
                        <input name="welcomeMsg" value={form.welcomeMsg} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                </div>
            </div>

            {/* 2. Theme Colors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Palette className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-800">Color Theme</h3>
                </div>
                <div className="flex gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Primary (Brand)</label>
                        <div className="flex items-center gap-3">
                            <input type="color" name="primaryColor" value={form.primaryColor} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                            <span className="font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-md">{form.primaryColor}</span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Secondary (Dark)</label>
                        <div className="flex items-center gap-3">
                            <input type="color" name="secondaryColor" value={form.secondaryColor} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent" />
                            <span className="font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-md">{form.secondaryColor}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Assets */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ImageIcon className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-800">Visual Assets</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                        <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setLogoFile, setPreviewLogo)} />
                        <label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-blue-600">Upload Logo</span>
                            <p className="text-xs text-slate-400 mt-1">PNG, SVG (Max 2MB)</p>
                        </label>
                    </div>

                    {/* Background Upload */}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
                        <input type="file" id="bg-upload" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, setBgFile, setPreviewBg)} />
                        <label htmlFor="bg-upload" className="cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
                                <Upload className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold text-blue-600">Login Background</span>
                            <p className="text-xs text-slate-400 mt-1">JPG, 1920x1080px</p>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Live Login Preview</h3>
            
            {/* MOCK LOGIN SCREEN */}
            <div 
                className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 bg-slate-900 flex items-center justify-center"
                style={{ 
                    '--preview-primary': form.primaryColor,
                    '--preview-secondary': form.secondaryColor
                }}
            >
                {/* Background Image Preview */}
                <div className="absolute inset-0 opacity-40">
                    {previewBg ? (
                        <img src={previewBg} className="w-full h-full object-cover" alt="Background" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--preview-primary)] to-[var(--preview-secondary)] opacity-20"></div>
                    )}
                </div>

                {/* Glass Card */}
                <div className="relative z-10 w-[80%] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
                    <div className="text-center">
                        {/* Logo Preview */}
                        <div className="inline-flex p-3 rounded-xl bg-gradient-to-tr from-[var(--preview-primary)] to-[var(--preview-secondary)] shadow-lg mb-4">
                            {previewLogo ? (
                                <img src={previewLogo} className="w-8 h-8 object-contain" alt="Logo" />
                            ) : (
                                <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{form.systemName}</h2>
                        <p className="text-[10px] text-slate-300 mt-1">{form.welcomeMsg}</p>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className="h-10 bg-black/20 rounded-lg w-full"></div>
                        <div className="h-10 bg-black/20 rounded-lg w-full"></div>
                        <div 
                            className="h-10 rounded-lg w-full mt-2 flex items-center justify-center text-xs font-bold text-white shadow-lg"
                            style={{ background: `linear-gradient(to right, ${form.primaryColor}, ${form.secondaryColor})` }}
                        >
                            Sign In
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
                <strong>Tip:</strong> These changes will apply globally to all users immediately after saving.
            </div>
        </div>

      </div>
    </div>
  );
};

export default SystemBranding;