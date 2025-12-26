import { Edit3, Lock, Save, Shield, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const UserForm = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    role: 'Staff'
  });

  // Pre-fill if Editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        full_name: initialData.full_name,
        username: initialData.username,
        role: initialData.role,
        password: '' // Keep empty to indicate "Don't Change"
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {initialData ? <Edit3 size={18} className="text-indigo-600"/> : <User size={18} className="text-indigo-600"/>}
                {initialData ? 'Edit Team Member' : 'Add Team Member'}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
                {initialData ? 'Update account details' : 'Create account credentials'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm hover:shadow">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input name="full_name" required value={formData.full_name} placeholder="e.g. Juan Dela Cruz" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm font-medium" onChange={handleChange} />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
                <div className="relative">
                    <Shield className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <select name="role" value={formData.role} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm appearance-none cursor-pointer" onChange={handleChange}>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="border-t border-gray-100 my-2"></div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username</label>
              <input name="username" required value={formData.username} placeholder="jdelacruz" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" onChange={handleChange} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {initialData ? 'New Password (Optional)' : 'Initial Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input name="password" type="password" required={!initialData} value={formData.password} placeholder={initialData ? "Leave blank to keep current" : "••••••••"} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm" onChange={handleChange} />
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button form="user-form" type="submit" className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
            <Save size={16} /> {initialData ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;