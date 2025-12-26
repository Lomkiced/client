import { useAuth } from '../../context/AuthContext'; // <--- Secure Import

// Import Dashboards
import QuickActions from '../../components/widgets/QuickActions';
import RecentActivity from '../../components/widgets/RecentActivity';
import StatsCards from '../../components/widgets/StatsCards';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';

// Super Admin View Component
const SuperAdminDashboard = () => (
  <div className="p-6 bg-gray-50 min-h-screen">
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      <p className="text-gray-500">Welcome back, Director.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatsCards title="Total Records" value="1,248" icon="📂" trend="up" color="bg-blue-100 text-blue-600" />
      <StatsCards title="Pending Approvals" value="45" icon="⏳" trend="down" color="bg-orange-100 text-orange-600" />
      <StatsCards title="System Users" value="12" icon="👥" trend="up" color="bg-purple-100 text-purple-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
      <div className="lg:col-span-2 h-full"><RecentActivity /></div>
      <div className="h-full"><QuickActions /></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth(); // <--- Get the REAL user from "The Vault"

  // SECURITY CHECK: If no user is logged in, show nothing (or redirect)
  if (!user) return <div className="p-10 text-center">Access Denied. Please Login.</div>;

  // Render based on the SECURE role from context
  return (
    <>
      {user.role === 'Super Admin' && <SuperAdminDashboard />}
      {user.role === 'Admin' && <AdminDashboard />}
      {user.role === 'Staff' && <StaffDashboard />}
    </>
  );
};

export default Dashboard;