import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  
  // 1. Initialize state
  const [stats, setStats] = useState({
    pendingApprovals: 0,
    activeProjects: 0,
    staffOnline: 0,
    recent_activity: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // FIX: Ensure we get the ID whether it is stored as 'region_id' or just 'region'
        // Based on your screenshot showing "7 Dashboard", user.region likely holds the value "7"
        const regionId = user.region_id || user.region;

        console.log("Fetching stats for Region ID:", regionId); // Check your browser console (F12) to see this!

        if (!regionId) {
            console.error("Region ID is missing from user object!");
            return;
        }

        // 2. Fetch real data from Backend
        const response = await axios.get(
          `http://localhost:5000/api/dashboard/stats?region_id=${regionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Security Key
            }
          }
        );
        
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="p-6">
      {/* Regional Header */}
      <div className="bg-blue-600 text-white rounded-2xl p-8 mb-6 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Region {user.region} Dashboard</h1>
          <p className="text-blue-100 mt-2">Regional Operational Overview</p>
        </div>
        <div className="absolute right-10 top-5 opacity-20 text-8xl">📍</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Pending Approvals</h3>
          <p className="text-4xl font-bold text-amber-500 mt-2">{stats.pendingApprovals}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Active Projects</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.activeProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase">Staff Online</h3>
          <p className="text-4xl font-bold text-emerald-500 mt-2">{stats.staffOnline}</p>
        </div>
      </div>

      {/* Recent Regional Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Recent Regional Submissions</h3>
        <div className="space-y-4">
          {stats.recent_activity.length > 0 ? (
            stats.recent_activity.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    R{index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">{record.title}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(record.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs border px-2 py-1 rounded ${
                  record.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                }`}>
                  {record.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 italic">No recent submissions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;