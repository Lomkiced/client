import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import {
  Building,
  Check,
  ChevronRight,
  Loader2,
  Lock,
  ShieldCheck,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBranding } from '../context/BrandingContext';
import { loginUser, registerUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', office: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Advanced States
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState(null);
  
  const controls = useAnimation();
  const { branding, loading: brandingLoading } = useBranding();

  // Calculate Password Strength
  useEffect(() => {
    const pwd = formData.password;
    let score = 0;
    if (pwd.length > 5) score++;
    if (pwd.length > 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  }, [formData.password]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate "Processing" Delay for UX
    await controls.start({ scale: 0.98, transition: { duration: 0.1 } });
    await controls.start({ scale: 1, transition: { duration: 0.1 } });

    try {
      if (isRegistering) {
        await registerUser(formData);
        alert("Registration successful! Please login.");
        setIsRegistering(false);
        setLoading(false);
      } else {
        await loginUser(formData);
        setLoading(false);
        setIsScanning(true); // Trigger Biometric Scan
        setTimeout(() => { onLoginSuccess(); }, 2200);
      }
    } catch (err) {
      setLoading(false);
      setError(typeof err === 'string' ? err : "Authentication failed.");
      
      // Error Shake Animation
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } });
    }
  };

  if (brandingLoading) return <div className="h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="animate-spin text-cyan-500" size={32}/></div>;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. DYNAMIC AURORA BACKGROUND */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        {/* Background Image with subtle pulse */}
        {branding.loginBgUrl && (
             <motion.img 
               src={branding.loginBgUrl} 
               className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale mix-blend-overlay"
               animate={{ scale: [1, 1.05, 1] }}
               transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
             />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black opacity-90"></div>
        
        {/* Interactive Orbs (React to focus) */}
        <motion.div 
          animate={{ 
            x: focusedField === 'username' ? -50 : 0, 
            scale: focusedField ? 1.2 : 1,
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: focusedField === 'password' ? 50 : 0, 
            scale: focusedField ? 1.2 : 1,
            opacity: [0.2, 0.4, 0.2] 
          }}
          transition={{ duration: 8, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[10%] w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-[120px]"
        />
      </div>

      {/* 2. MAIN CARD */}
      <motion.div 
        animate={controls}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden ring-1 ring-white/5">
          
          {/* BIOMETRIC SCAN OVERLAY */}
          <AnimatePresence>
            {isScanning && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center border-2 border-cyan-500/50 rounded-3xl"
              >
                 <motion.div 
                   className="absolute top-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                   animate={{ top: ["0%", "100%", "0%"] }}
                   transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                 />
                 <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center z-10"
                 >
                    <div className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-cyan-500/30 relative">
                        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping"></div>
                        <ShieldCheck size={48} className="text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">Access Granted</h2>
                    <p className="text-cyan-400/60 text-xs mt-2 font-mono">Initializing Workspace...</p>
                 </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGIN CONTENT */}
          <div className="p-10 relative z-10">
            
            {/* Header */}
            <div className="text-center mb-10">
              <motion.div 
                 whileHover={{ rotate: 360, scale: 1.1 }}
                 transition={{ duration: 0.8 }}
                 className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl mb-5 border border-white/10 shadow-lg"
              >
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt="Logo" className="h-8 w-auto" />
                ) : (
                  <span className="text-3xl font-black text-white">{branding.systemName.charAt(0)}</span>
                )}
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">{branding.systemName}</h1>
              <div className="flex items-center justify-center gap-2 opacity-60">
                 <div className="h-px w-8 bg-gradient-to-r from-transparent to-slate-400"></div>
                 <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">{branding.orgName}</p>
                 <div className="h-px w-8 bg-gradient-to-l from-transparent to-slate-400"></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username Input */}
              <div className="group relative">
                 <User className={`absolute left-4 top-3.5 transition-colors duration-300 ${focusedField === 'username' ? 'text-cyan-400' : 'text-slate-500'}`} size={20} />
                 <input 
                   type="text" 
                   name="username" 
                   placeholder="Identity ID / Username" 
                   required
                   className="w-full bg-slate-950/60 border border-slate-700/60 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 text-sm font-medium focus:bg-slate-900/80"
                   value={formData.username}
                   onChange={handleInputChange}
                   onFocus={() => setFocusedField('username')}
                   onBlur={() => setFocusedField(null)}
                 />
                 {/* Valid Indicator */}
                 {formData.username.length > 3 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-4 text-emerald-500">
                       <Check size={16} />
                    </motion.div>
                 )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                 <div className="group relative">
                    <Lock className={`absolute left-4 top-3.5 transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-slate-500'}`} size={20} />
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Secure Access Key" 
                      required
                      className="w-full bg-slate-950/60 border border-slate-700/60 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 text-sm font-medium focus:bg-slate-900/80"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                 </div>
                 
                 {/* Password Strength Meter (Only show when typing) */}
                 <AnimatePresence>
                    {formData.password.length > 0 && (
                       <motion.div 
                          initial={{ height: 0, opacity: 0 }} 
                          animate={{ height: 'auto', opacity: 1 }} 
                          exit={{ height: 0, opacity: 0 }}
                          className="flex gap-1 h-1"
                       >
                          {[1, 2, 3, 4, 5].map((level) => (
                             <div 
                               key={level} 
                               className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= level ? 
                                  (passwordStrength < 3 ? 'bg-red-500' : passwordStrength < 5 ? 'bg-amber-500' : 'bg-emerald-500') 
                                  : 'bg-slate-800'}`}
                             ></div>
                          ))}
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Registration Extra Field */}
              <AnimatePresence>
                {isRegistering && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                     <div className="group relative mb-5">
                        <Building className={`absolute left-4 top-3.5 transition-colors duration-300 ${focusedField === 'office' ? 'text-cyan-400' : 'text-slate-500'}`} size={20} />
                        <input 
                          type="text" 
                          name="office" 
                          placeholder="Department / Unit" 
                          required
                          className="w-full bg-slate-950/60 border border-slate-700/60 text-slate-200 pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600 text-sm font-medium focus:bg-slate-900/80"
                          value={formData.office}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('office')}
                          onBlur={() => setFocusedField(null)}
                        />
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
                  >
                     <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="text-red-400 text-xs font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading || isScanning}
                className="group relative w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      <span>{isRegistering ? 'Initialize Account' : 'Authenticate'}</span> 
                      {!isRegistering && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </>
                  )}
                </div>
              </button>

            </form>

            {/* Footer / Toggle */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
               <button 
                 onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                 className="text-slate-500 hover:text-cyan-400 text-xs font-medium transition-colors"
               >
                 {isRegistering ? "Return to Login" : "New User Registration"}
               </button>
            </div>

          </div>
        </div>
        
        {/* System Status Footer */}
        <div className="flex justify-center items-center gap-2 mt-8 opacity-40">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <p className="text-[10px] text-slate-400 font-mono tracking-widest">SYSTEM OPERATIONAL • V2.5</p>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;