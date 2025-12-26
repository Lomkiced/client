import { useState } from 'react';
import UserModal from '../../components/widgets/UserModal';
import { useAuth } from '../../context/AuthContext';
import { useRegions } from '../../context/RegionContext'; // <--- CONNECTED

const MOCK_USERS = [
  { id: 1, name: 'Dr. Maria Santos', email: 'm.santos@dost.gov.ph', role: 'Super Admin', dept: 'Office of the Director', region: 'Central Office', status: 'Active' },
  { id: 2, name: 'John Rey Garcia', email: 'j.garcia@dost.gov.ph', role: 'Admin', dept: 'IT Management', region: 'Ilocos Region', status: 'Active' },
  { id: 3, name: 'Ana Reyes', email: 'a.reyes@dost.gov.ph', role: 'Staff', dept: 'Records Section', region: 'Ilocos Region', status: 'Inactive' },
];

const UserList = () => {
  const { user } = useAuth();
  const { regions } = useRegions(); // <--- FETCH DYNAMIC REGIONS
  const [users, setUsers] = useState(MOCK_USERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('All');

  const handleSaveUser = (modalData) => {
    const newUser = {
      id: users.length + 1,
      name: modalData.fullName,
      email: modalData.email,
      role: modalData.role,
      dept: modalData.department,
      region: modalData.region || 'Ilocos Region', // Ideally comes from modal
      status: modalData.status
    };
    setUsers([newUser, ...users]);
  };

  // FILTER LOGIC
  const filteredUsers = selectedRegionFilter === 'All' 
    ? users 
    : users.filter(u => u.region === selectedRegionFilter);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Admin': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => status === 'Active' ? 'bg-green-500' : 'bg-red-400';

  return (
    <div className="p-6 h-[calc(100vh-2rem)] flex flex-col animate-fade-in">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Team Directory</h1>
          <p className="text-gray-500 text-sm">Manage system access across all regions.</p>
        </div>

        <div className="flex gap-3">
          {/* DYNAMIC REGION FILTER (Only for Super Admin) */}
          {user.role === 'Super Admin' && (
            <select 
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
            >
              <option value="All">All Regions</option>
              <option value="Central Office">Central Office</option>
              {/* MAPPING REAL REGIONS FROM CONTEXT */}
              {regions.map(r => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          )}

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 font-medium"
          >
            <span>+</span> Add Member
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <th className="px-6 py-4">User Profile</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                {/* NEW REGION COLUMN */}
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {user.region}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.dept}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                    <span className="text-sm text-gray-600">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-blue-600 p-2">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserList;