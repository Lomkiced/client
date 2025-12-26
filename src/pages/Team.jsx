import {
  Briefcase,
  Edit,
  Lock,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  Unlock,
  UserPlus,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import UserForm from '../components/UserForm';
import { createUser, deleteUser, getUsers, updateUser, updateUserStatus } from '../services/api'; // Added new imports

const TeamDirectory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Track user being edited

  const [searchTerm, setSearchTerm] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  // --- DATA LOADING ---
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) { console.error("Failed to load users"); }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  // --- HANDLERS ---
  
  // Unified Save (Create or Update)
  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.user_id, formData);
      } else {
        await createUser(formData);
      }
      setIsModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (err) { alert("Action failed"); }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if(confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) {
        try {
            await deleteUser(id);
            setActiveMenu(null);
            loadUsers();
        } catch (err) { alert("Failed to delete user"); }
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
        await updateUserStatus(id, newStatus);
        setActiveMenu(null);
        loadUsers();
    } catch (err) { alert("Action failed"); }
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  const getAvatarColor = (role) => role === 'Admin' ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600';

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.office.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" /> Team Directory
          </h1>
          <p className="text-sm text-gray-500">Manage access and roles for your organization</p>
        </div>
        <button 
          onClick={() => { setEditingUser(null); setIsModalOpen(true); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all hover:-translate-y-0.5 font-medium"
        >
          <UserPlus size={18} /> Add Member
        </button>
      </div>

      {/* 2. SEARCH */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm flex items-center">
          <Search className="ml-4 text-gray-400" size={20} />
          <input 
              type="text" 
              placeholder="Find a team member..." 
              className="w-full px-4 py-2 outline-none text-sm text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* 3. USER GRID */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
                <div key={user.user_id} className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl relative overflow-visible ${user.status === 'Suspended' ? 'border-red-100 opacity-75' : 'border-gray-100'}`}>
                    
                    <div className={`h-1.5 w-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'} rounded-t-2xl`}></div>

                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-inner ${getAvatarColor(user.role)}`}>
                                {getInitials(user.full_name)}
                            </div>
                            
                            <div className="relative">
                                <button onClick={() => setActiveMenu(activeMenu === user.user_id ? null : user.user_id)} className="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-50 transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                                
                                {/* ACTIONS DROPDOWN */}
                                {activeMenu === user.user_id && (
                                    <div className="absolute right-0 top-8 w-48 bg-white shadow-xl rounded-lg border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                        <div className="p-1">
                                            <button onClick={() => handleEdit(user)} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                                                <Edit size={14} className="text-gray-400"/> Edit Details
                                            </button>
                                            
                                            <button onClick={() => toggleStatus(user.user_id, user.status)} className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                                                {user.status === 'Active' ? <Lock size={14} className="text-gray-400"/> : <Unlock size={14} className="text-emerald-500"/>}
                                                {user.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                                            </button>
                                            
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            
                                            <button onClick={() => handleDelete(user.user_id)} className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
                                                <Trash2 size={14} /> Delete User
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 truncate">{user.full_name}</h3>
                        <p className="text-sm text-gray-500 mb-4 truncate">@{user.username}</p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                <Briefcase size={14} className="text-indigo-400" /> <span className="font-medium">{user.office}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                                <Shield size={14} className={user.role === 'Admin' ? 'text-amber-500' : 'text-blue-400'} /> <span className="font-medium">{user.role}</span>
                            </div>
                        </div>
                    </div>
                    {/* Click Outside Handler */}
                    {activeMenu === user.user_id && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)}></div>}
                </div>
            ))}
        </div>
      )}

      {isModalOpen && (
        <UserForm 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSave} 
            initialData={editingUser} 
        />
      )}
    </div>
  );
};

export default TeamDirectory;