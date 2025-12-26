import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ onLogout }) => {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar stays fixed on the left */}
      <Sidebar onLogout={onLogout} />

      {/* Main Content Area scrolls independently */}
      <main className="flex-1 h-full relative overflow-y-auto flex flex-col">
        {/* This is where UserProfile.jsx will render */}
        <Outlet />
      </main>
      
    </div>
  );
};

export default Layout;

