import { createContext, useContext, useEffect, useState } from 'react';

const CodexContext = createContext();

export const CodexProvider = ({ children }) => {
  // 1. MASTER DATA: Categories (NAP Series)
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('dost_codex_cats');
    return saved ? JSON.parse(saved) : [
      { category_id: 1, name: 'Administrative Records', region: 'Global' },
      { category_id: 2, name: 'Financial Records', region: 'Global' },
      { category_id: 3, name: 'Legal Records', region: 'Global' },
      { category_id: 4, name: 'Ilocos Heritage Projects', region: 'Ilocos Region' }, // Specific to R1
      { category_id: 5, name: 'Metro Manila Operations', region: 'National Capital Region' }, // Specific to NCR
    ];
  });

  // 2. MASTER DATA: Document Types (Rules)
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem('dost_codex_types');
    return saved ? JSON.parse(saved) : [
      { type_id: 101, category_id: 1, type_name: 'Annual Reports', retention_period: 'Permanent', region: 'Global' },
      { type_id: 102, category_id: 1, type_name: 'Office Orders / Memos', retention_period: '5 Years', region: 'Global' },
      { type_id: 201, category_id: 2, type_name: 'Disbursement Vouchers', retention_period: '10 Years', region: 'Global' },
      { type_id: 202, category_id: 2, type_name: 'Payroll Registers', retention_period: '15 Years', region: 'Global' },
      { type_id: 401, category_id: 4, type_name: 'Heritage Site Blueprints', retention_period: 'Permanent', region: 'Ilocos Region' },
    ];
  });

  // Persist to LocalStorage
  useEffect(() => { localStorage.setItem('dost_codex_cats', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('dost_codex_types', JSON.stringify(types)); }, [types]);

  // Actions
  const addCategory = (cat) => setCategories([...categories, { ...cat, category_id: Date.now() }]);
  const deleteCategory = (id) => setCategories(categories.filter(c => c.category_id !== id));
  
  const addType = (type) => setTypes([...types, { ...type, type_id: Date.now() }]);
  const deleteType = (id) => setTypes(types.filter(t => t.type_id !== id));

  return (
    <CodexContext.Provider value={{ categories, types, addCategory, deleteCategory, addType, deleteType }}>
      {children}
    </CodexContext.Provider>
  );
};

export const useCodex = () => useContext(CodexContext);