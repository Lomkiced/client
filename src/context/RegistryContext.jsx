import { createContext, useContext, useEffect, useState } from 'react';

const RegistryContext = createContext();

export const RegistryProvider = ({ children }) => {
  // 1. INITIALIZE DATABASE (Load from Storage or Seed)
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('dost_registry_db');
    // Seed data ONLY if storage is empty (First time run or cleared cache)
    if (!saved) {
      const initialData = [
        { 
          id: 'DOC-2024-001', 
          title: 'Region 1 Financial Report', 
          category: 'Financial Records', 
          type_name: 'Annual Reports', 
          status: 'Active', 
          date: '2024-12-01', 
          disposal_date: 'Permanent', // Matches Rule 101
          region: 'Ilocos Region' 
        },
        { 
          id: 'DOC-2024-002', 
          title: 'Manila HQ Audit', 
          category: 'Financial Records', 
          type_name: 'Audit Logs', 
          status: 'Active', 
          date: '2024-11-20', 
          disposal_date: '2029-11-20', // Calculated (5 Years)
          region: 'National Capital Region' 
        },
      ];
      return initialData;
    }
    return JSON.parse(saved);
  });

  // 2. PERSISTENCE LAYER (Auto-Save on Change)
  useEffect(() => {
    localStorage.setItem('dost_registry_db', JSON.stringify(records));
  }, [records]);

  // 3. DATABASE OPERATIONS (CRUD)
  
  const addRecord = (data) => {
    const newRecord = {
      ...data, // Spreads title, region, category, disposal_date from Form
      id: `DOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generate ID
      date: new Date().toISOString().split('T')[0], // Set Upload Date to Today
      status: 'Active'
    };
    setRecords(prev => [newRecord, ...prev]); // Add to top of list
  };

  const updateRecord = (id, updatedData) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const archiveRecord = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Archived' } : r));
  };

  const restoreRecord = (id) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Active' } : r));
  };

  const destroyRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <RegistryContext.Provider value={{ 
      records, 
      addRecord, 
      updateRecord, 
      archiveRecord, 
      restoreRecord, 
      destroyRecord 
    }}>
      {children}
    </RegistryContext.Provider>
  );
};

export const useRegistry = () => useContext(RegistryContext);