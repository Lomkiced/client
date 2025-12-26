import {
    Activity,
    Camera, Check, CheckCircle2,
    Clock, Globe, LayoutGrid, Loader2, Lock, Save, Shield,
    User
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { changePassword, getSecurityActivity, getUserProfile, updateUserProfile } from '../services/api';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Data States
  const [formData, setFormData] = useState({});
  const [activityLogs, setActivityLogs] = useState([]);
  
  // Avatar States
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Security States
  const [securityData, setSecurityData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 1. INITIAL LOAD
  useEffect(() => {
    const loadData = async () => {
      try {
        const [profile, activity] = await Promise.all([
          getUserProfile(),
          getSecurityActivity() // Fetch the new activity logs
        ]);

        setFormData(profile);
        setActivityLogs(activity || []);

        // Handle Avatar URL
        if (profile.avatarUrl) {
           const cleanPath = profile.avatarUrl.replace(/\\/g, '/');
           const finalPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
           setAvatarPreview(`http://localhost:5000${finalPath}`);
        }
      } catch (err) {
        console.error("Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. PASSWORD STRENGTH LOGIC
  useEffect(() => {
    const p = securityData.newPassword;
    let score = 0;
    if (p.length > 7) score++;
    if (p.length > 11) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    setPasswordStrength(score);
  }, [securityData.newPassword]);

  // Handlers
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSecurityChange = (e) => setSecurityData({ ...securityData, [e.target.name]: e.target.value });
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      const submission = new FormData();
      Object.keys(formData).forEach(key => submission.append(key, formData[key] || ''));
      if (selectedFile) submission.append('avatar', selectedFile);

      const response = await updateUserProfile(submission);
      if (response.avatarUrl) setAvatarPreview(`http://localhost:5000${response.avatarUrl}`);
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) { alert("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  const handleSaveSecurity = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) return alert("Passwords do not match");
    if (passwordStrength < 3) return alert("Password is too weak. Please strengthen it.");
    
    setIsSaving(true);
    try {
        await changePassword(securityData);
        alert("Password updated successfully. Please log in again.");
        setSecurityData({currentPassword:'', newPassword:'', confirmPassword:''});
    } catch (e) { alert("Failed to update password. Check current password."); }
    finally { setIsSaving(false); }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading Profile...</div>;

  return (
    <div className="flex-1 bg-slate-50 h-full overflow-y-auto p-4 md:p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
           <p className="text-slate-500 text-sm">Manage your profile and security preferences.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border flex">
            <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={LayoutGrid} label="General" />
            <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Shield} label="Security" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Info */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-2xl p-6 shadow-sm border text-center">
                <div className="relative inline-block mt-4 cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    <div className="w-32 h-32 rounded-full border-4 border-slate-100 overflow-hidden bg-slate-50 mx-auto relative">
                        {avatarPreview ? (
                            <img src={avatarPreview} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><User size={64}/></div>
                        )}
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all rounded-full">
                           <Camera className="text-white" />
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full text-white shadow-lg border-2 border-white group-hover:scale-110 transition">
                        <Camera size={14} />
                    </div>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                <h2 className="text-xl font-bold mt-4 text-slate-800">{formData.fullName || 'User'}</h2>
                <p className="text-indigo-600 font-medium text-sm">{formData.role}</p>
           </div>
           
           {/* Mini Security Summary */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={16} className="text-emerald-500"/> Account Status</h3>
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500">Status</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-full text-xs">Active</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500">2FA</span>
                    <span className="text-slate-400 font-mono text-xs">Disabled</span>
                 </div>
                 <div className="flex justify-between py-2">
                    <span className="text-slate-500">Last Login</span>
                    <span className="text-slate-700 font-medium">Just now</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-2">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-2xl shadow-sm border p-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">Personal Information</h3>
                        {isSaved && <span className="text-emerald-600 text-sm font-bold flex items-center gap-1"><CheckCircle2 size={16}/> Saved</span>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                        <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
                        <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                        <Input label="Location" name="location" value={formData.location} onChange={handleChange} />
                        <div className="md:col-span-2"><Input label="Department" name="department" value={formData.department} onChange={handleChange} /></div>
                    </div>
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Bio</label>
                        <textarea name="bio" rows="3" value={formData.bio} onChange={handleChange} className="w-full p-3 border rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSaveGeneral} disabled={isSaving} className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-md shadow-indigo-200">
                            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                        </button>
                    </div>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    
                    {/* Password Change Card */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                       <h3 className="font-bold text-lg text-slate-800 mb-1">Change Password</h3>
                       <p className="text-slate-500 text-sm mb-6">Update your password to allow authorized access.</p>
                       
                       <div className="grid md:grid-cols-2 gap-8">
                           <div className="space-y-4">
                               <Input label="Current Password" type="password" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} />
                               <Input label="New Password" type="password" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} />
                               <Input label="Confirm Password" type="password" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} />
                           </div>

                           {/* Password Strength Visuals */}
                           <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                               <h4 className="font-bold text-slate-700 text-sm mb-3">Password Strength</h4>
                               <div className="flex gap-1 h-2 mb-4">
                                   {[1,2,3,4,5].map(step => (
                                       <div key={step} className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= step ? (passwordStrength < 3 ? 'bg-red-400' : passwordStrength < 4 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-slate-200'}`}></div>
                                   ))}
                               </div>
                               <ul className="space-y-2 text-xs text-slate-500">
                                   <Requirement label="At least 8 characters" met={securityData.newPassword.length > 7} />
                                   <Requirement label="Contains a number" met={/[0-9]/.test(securityData.newPassword)} />
                                   <Requirement label="Contains a special symbol" met={/[^A-Za-z0-9]/.test(securityData.newPassword)} />
                               </ul>
                           </div>
                       </div>

                       <div className="flex justify-end mt-6 pt-4 border-t border-slate-100">
                            <button onClick={handleSaveSecurity} disabled={isSaving} className="bg-slate-800 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-900 disabled:opacity-50 font-medium">
                                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />} Update Password
                            </button>
                       </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Recent Activity</h3>
                                <p className="text-slate-500 text-sm">Recent security events detected on your account.</p>
                            </div>
                            <Activity className="text-slate-300" />
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activityLogs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No recent activity detected.</div>
                            ) : activityLogs.map((log, i) => (
                                <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                    <div className={`p-2 rounded-full ${log.action === 'LOGIN' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {log.action === 'LOGIN' ? <Globe size={18} /> : <Lock size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-700">{log.action === 'LOGIN' ? 'New Login Detected' : 'Password Changed'}</h4>
                                        <p className="text-xs text-slate-500">{log.ip_address === '::1' ? 'Localhost' : log.ip_address} • {log.details || 'Web Access'}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock size={12} /> {new Date(log.created_at).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-slate-300">{new Date(log.created_at).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
        <Icon size={16} /> {label}
    </button>
);
const Input = ({ label, ...props }) => (
    <div className="w-full space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <input className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all" {...props} />
    </div>
);
const Requirement = ({ label, met }) => (
    <li className={`flex items-center gap-2 ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
        {met ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300"></div>}
        {label}
    </li>
);

export default UserProfile;