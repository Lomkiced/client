import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- PROFESSIONAL SVG ICON SET (Replacing Emojis) ---
const Icons = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  Globe: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M12 2.25a15.75 15.75 0 010 19.5M12 2.25a15.75 15.75 0 000 19.5" /></svg>,
  Folder: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  Shield: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
  Palette: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.077-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.85 6.361a15.996 15.996 0 00-4.647 4.763m0 0c-.647.382-1.333.713-2.05 1.016" /></svg>,
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  ChevronLeft: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>,
  Book: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  // --- NEW ICON ADDED ---
  Map: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!user) return null;

  // --- MENU CONFIGURATION WITH REGIONS & CODEX ---
  const ROLE_MENUS = {
    'Super Admin': [
      { category: 'Overview', items: [{ path: '/dashboard', label: 'Dashboard', icon: Icons.Dashboard }, { path: '/global-map', label: 'Global Map', icon: Icons.Globe }] },
      { 
        category: 'Governance', // Renamed from Management to encompass Regions/Rules
        items: [
          { path: '/regions', label: 'Regions', icon: Icons.Map }, // <--- NEW REGION MANAGER
          { path: '/registry', label: 'Registry', icon: Icons.Folder }, 
          { path: '/codex', label: 'Codex (Rules)', icon: Icons.Book }, 
          { path: '/users', label: 'Team', icon: Icons.Users }
        ] 
      },
      { category: 'Security', items: [{ path: '/audit', label: 'Audit Logs', icon: Icons.Shield }, { path: '/branding', label: 'Branding', icon: Icons.Palette }] }
    ],
    'Admin': [
      { category: 'Regional', items: [{ path: '/dashboard', label: 'Dashboard', icon: Icons.Dashboard }, { path: '/registry', label: 'Documents', icon: Icons.Folder }, { path: '/codex', label: 'Codex (Rules)', icon: Icons.Book }] },
      { category: 'Team', items: [{ path: '/users', label: 'My Staff', icon: Icons.Users }] }
    ],
    'Staff': [
      { category: 'Workspace', items: [{ path: '/dashboard', label: 'Home', icon: Icons.Home }, { path: '/registry', label: 'Search Files', icon: Icons.Search }, { path: '/codex', label: 'Codex (Rules)', icon: Icons.Book }] }
    ]
  };

  const currentMenu = ROLE_MENUS[user.role] || ROLE_MENUS['Staff'];

  // Role-based subtle gradient accents
  const getAccentGradient = () => {
    switch(user.role) {
      case 'Super Admin': return 'from-purple-500/20 to-blue-500/20 shadow-purple-500/10';
      case 'Admin': return 'from-blue-500/20 to-cyan-500/20 shadow-blue-500/10';
      default: return 'from-emerald-500/20 to-teal-500/20 shadow-emerald-500/10';
    }
  };

  return (
    // GLASSMORPHISM CONTAINER
    <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } bg-slate-900/80 backdrop-blur-xl border-r border-white/10 h-screen text-slate-100 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) relative z-20 shadow-[0_0_40px_rgba(0,0,0,0.3)]`}
    >
      
      {/* --- GLASS TOGGLE BUTTON --- */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-10 bg-slate-800/50 backdrop-blur-md border border-white/20 text-slate-300 p-1.5 rounded-full shadow-lg hover:bg-blue-500/80 hover:text-white transition-all hover:scale-110 active:scale-95 z-50"
      >
        {isCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
      </button>

      {/* --- HEADER --- */}
      <div className={`p-6 mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} transition-all duration-500 delay-100`}>
        <div className={`relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white overflow-hidden transition-all duration-500 ${isCollapsed ? 'scale-110' : ''}`}>
           {/* Subtle background gradient for logo */}
           <div className={`absolute inset-0 bg-gradient-to-br ${getAccentGradient()} opacity-50`}></div>
           <span className="relative z-10 drop-shadow-sm">R</span>
        </div>
        
        <div className={`ml-3 overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0 -translate-x-4' : 'w-auto opacity-100 translate-x-0'}`}>
          <h2 className="font-bold text-lg leading-tight tracking-tight whitespace-nowrap drop-shadow-sm">DOST-RMS</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest whitespace-nowrap">{user.role}</p>
        </div>
      </div>

      {/* --- NAVIGATION LINKS --- */}
      <nav className="flex-1 px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar overflow-x-hidden">
        {currentMenu.map((section, idx) => (
          <div key={idx}>
            {/* Section Label (Fades out) */}
            <div className={`px-3 mb-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100 delay-200'}`}>
              <p className="text-[10px] font-bold text-slate-500/80 uppercase tracking-wider">
                {section.category}
              </p>
            </div>

            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 my-1 rounded-2xl transition-all duration-300 group overflow-hidden ${
                      isActive 
                        // ACTIVE STATE: Subtle gradient glow, light border, inner shadow
                        ? `bg-gradient-to-r ${getAccentGradient()} text-white border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]` 
                        // INACTIVE STATE: Subtle hover effect
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span className={`relative z-10 transition-transform duration-300 ${isCollapsed ? 'scale-110' : 'group-hover:scale-110'}`}>
                    <item.icon />
                  </span>

                  <span className={`relative z-10 ml-3 font-medium text-sm whitespace-nowrap transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 delay-100'}`}>
                    {item.label}
                  </span>

                   {/* HOVER TOOLTIP (Glass style) */}
                   {isCollapsed && (
                    <div className="absolute left-16 bg-slate-900/90 backdrop-blur-md text-slate-100 text-xs font-medium px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-white/10 whitespace-nowrap z-50 translate-x-2 group-hover:translate-x-0">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* --- GLASS FOOTER --- */}
      <div className="p-3 m-3 rounded-2xl bg-black/20 border border-white/5 backdrop-blur-md">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-3'} transition-all duration-500`}>
          
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-sm">
            {user.name.charAt(0)}
          </div>
          
          <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-500 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100 delay-200'}`}>
            <p className="text-sm font-medium text-white truncate drop-shadow-sm">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.department}</p>
          </div>

           {/* Mini Logout Icon when collapsed */}
           {isCollapsed && (
             <button onClick={logout} className="mt-4 text-red-400 hover:text-red-300 transition-colors p-1" title="Sign Out">
               <Icons.Logout />
             </button>
          )}
        </div>
        
        {/* Full Logout Button when expanded */}
        {!isCollapsed && (
          <button 
            onClick={logout}
            className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 w-full text-xs font-bold text-red-300/80 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all uppercase tracking-wide delay-300"
          >
            <Icons.Logout />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;