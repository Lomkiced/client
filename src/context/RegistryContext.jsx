import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../services/endpoints/api';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const RegistryContext = createContext();

export const RegistryProvider = ({ children }) => {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, current: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: '', category: 'All', page: 1, status: 'Active', region: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 1. FETCH RECORDS
  const fetchRecords = useCallback(async (overrideFilters = {}) => {
    try {
      setLoading(true);
      const activeFilters = { ...filters, ...overrideFilters };
      setFilters(activeFilters);

      const result = await api.getRecords({
        page: activeFilters.page || 1,
        limit: 10,
        search: activeFilters.search || '',
        category: activeFilters.category || 'All',
        status: activeFilters.status || 'Active',
        region: activeFilters.region || ''
      });

      if (result) {
        setRecords(result.data || []);
        setPagination(result.pagination || { total: 0, current: 1, pages: 1 });
      }
    } catch (err) {
      console.error("Registry Load Error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (user) fetchRecords();
  }, [user]);

  // 2. CRUD OPERATIONS
  const uploadRecord = async (formData) => {
    setUploading(true);
    try {
      await api.createRecord(formData);
      await fetchRecords();
      toast.success("Record created successfully");
      setUploading(false);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload Failed");
      setUploading(false);
      return false;
    }
  };

  const updateRecord = async (id, formData) => {
    setUploading(true);
    try {
      await api.updateRecord(id, formData);
      await fetchRecords();
      setUploading(false);
      return true;
    } catch (err) {
      console.error("Update Error:", err);
      setUploading(false);
      return false;
    }
  };

  // --- ARCHIVE FIX ---
  const archiveRecord = async (id) => {
    try {
      setUploading(true);
      console.log("Archiving ID:", id); // Debug
      await api.archiveRecord(id);
      // Force refresh with current filters
      await fetchRecords();
    } catch (err) {
      console.error("Archive Error in Context:", err);
      toast.error("Failed to archive record. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  const restoreRecord = async (id) => {
    try {
      await api.restoreRecord(id);
      await fetchRecords();
    } catch (err) { console.error(err); }
  };

  const destroyRecord = async (id) => {
    if (!window.confirm("Permanent Delete? This cannot be undone.")) return;
    try {
      await api.deleteRecord(id);
      await fetchRecords();
    } catch (err) { console.error(err); }
  };

  return (
    <RegistryContext.Provider value={{
      records, pagination, filters, loading, uploading,
      fetchRecords, uploadRecord, updateRecord,
      archiveRecord, restoreRecord, destroyRecord
    }}>
      {children}
    </RegistryContext.Provider>
  );
};

export const useRegistry = () => useContext(RegistryContext);