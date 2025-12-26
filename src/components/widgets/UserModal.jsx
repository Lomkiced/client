import { useEffect, useState } from 'react';
import { useRegions } from '../../context/RegionContext'; // <--- CONNECT TO REGION DB

const UserModal = ({ isOpen, onClose, onSave }) => {
  const { regions } = useRegions(); // <--- FETCH REAL REGIONS
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Staff',
    region: '', // Stores the selected Region Name
    department: '', // Stores specific unit (e.g. "HR Section")
    status: 'Active'
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        role: 'Staff',
        region: regions.length > 0 ? regions[0].name : '', // Default to first region
        department: '',
        status: 'Active'
      });
    }
  }, [isOpen, regions]);

  // SMART LOGIC: If Role becomes 'Super Admin', lock Region to 'Central Office'
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    if (newRole === 'Super Admin') {
      setFormData(prev => ({ ...prev, role: newRole, region: 'Central Office' }));
    } else {
      // If switching back to Admin/Staff, reset region to first available option
      setFormData(prev => ({ 
        ...prev, 
        role: newRole, 
        region: regions.length > 0 ? regions[0].name : '' 
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        
        {/* Modal Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800 text-xl">Add Team Member</h3>
            <p className="text-xs text-gray-500 mt-1">Create a new account and assign access privileges.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Full Name & Email */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
              <input 
                required autoFocus
                type="text" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="e.g. Juan Dela Cruz"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Government Email</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                placeholder="juan@region1.dost.gov.ph"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 my-2"></div>

          {/* Role & Region (The Core Logic) */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Role</label>
              <select 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                value={formData.role}
                onChange={handleRoleChange}
              >
                <option value="Staff">Staff (Encoder)</option>
                <option value="Admin">Regional Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Region</label>
              {formData.role === 'Super Admin' ? (
                // LOCKED INPUT FOR SUPER ADMIN
                <input 
                  disabled
                  className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 text-gray-500 rounded-xl text-sm cursor-not-allowed font-medium"
                  value="Central Office (Global)"
                />
              ) : (
                // DYNAMIC DROPDOWN FOR OTHERS
                <select 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.name}>
                      {region.name} ({region.code})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Department / Unit */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Office Unit / Department</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              placeholder="e.g. Human Resources Section"
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-bold text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-200 transform active:scale-95"
            >
              Confirm & Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;