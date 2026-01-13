import { createContext, useContext, useEffect, useState } from 'react';

const BrandingContext = createContext();

export const BrandingProvider = ({ children }) => {
  const [branding, setBranding] = useState({
    systemName: 'DOST-RMS',
    orgName: 'Department of Science and Technology',
    welcomeMsg: 'Sign in to access the system.',
    logoUrl: null,
    loginBgUrl: null,
    primaryColor: '#4f46e5',    // Indigo-600
    secondaryColor: '#0f172a'   // Slate-900
  });
  const [loading, setLoading] = useState(true);

  const applyTheme = (brandData) => {
    const root = document.documentElement;
    // Inject CSS Variables for instant theming
    root.style.setProperty('--color-primary', brandData.primary_color || '#4f46e5');
    root.style.setProperty('--color-secondary', brandData.secondary_color || '#0f172a');
  };

  const loadBrand = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/settings');
      const data = await res.json();
      
      if (data) {
        applyTheme(data); // <--- Apply CSS Variables
        setBranding({
          systemName: data.system_name,
          orgName: data.org_name,
          welcomeMsg: data.welcome_msg,
          logoUrl: data.logo_url ? `http://localhost:5000${data.logo_url}` : null,
          loginBgUrl: data.login_bg_url ? `http://localhost:5000${data.login_bg_url}` : null,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color
        });
      }
    } catch (err) {
      console.error("Failed to load branding:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBrand(); }, []);

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding: loadBrand }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => useContext(BrandingContext);