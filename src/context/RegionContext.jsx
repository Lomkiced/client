import { createContext, useContext, useEffect, useState } from 'react';

const RegionContext = createContext();

export const RegionProvider = ({ children }) => {
  // 1. Initialize with Default Regions (or load from storage)
  const [regions, setRegions] = useState(() => {
    const saved = localStorage.getItem('dost_regions');
    return saved ? JSON.parse(saved) : [
      { id: 'R1', code: 'REGION-1', name: 'Ilocos Region', status: 'Active', address: 'San Fernando, La Union' },
      { id: 'NCR', code: 'NCR', name: 'National Capital Region', status: 'Active', address: 'Taguig City, Metro Manila' },
      { id: 'CAR', code: 'CAR', name: 'Cordillera Admin Region', status: 'Inactive', address: 'Baguio City' },
    ];
  });

  // 2. Persist changes
  useEffect(() => {
    localStorage.setItem('dost_regions', JSON.stringify(regions));
  }, [regions]);

  // 3. CRUD Actions
  const addRegion = (region) => {
    setRegions([...regions, { ...region, id: `REG-${Date.now()}` }]);
  };

  const updateRegion = (id, updatedData) => {
    setRegions(regions.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRegion = (id) => {
    setRegions(regions.filter(r => r.id !== id));
  };

  const toggleStatus = (id) => {
    setRegions(regions.map(r => 
      r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r
    ));
  };

  return (
    <RegionContext.Provider value={{ regions, addRegion, updateRegion, deleteRegion, toggleStatus }}>
      {children}
    </RegionContext.Provider>
  );
};

export const useRegions = () => useContext(RegionContext);