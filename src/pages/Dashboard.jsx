import QuickActions from '../../components/widgets/QuickActions'; // Note the double ../..
import RecentActivity from '../../components/widgets/RecentActivity'; // Note the double ../..
import StatsCards from '../../components/widgets/StatsCards'; // Note the double ../..

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Administrator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCards title="Total Records" value="1,248" icon="📂" trend="up" color="bg-blue-100 text-blue-600" />
        <StatsCards title="Pending Approvals" value="45" icon="⏳" trend="down" color="bg-orange-100 text-orange-600" />
        <StatsCards title="System Users" value="12" icon="👥" trend="up" color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
        <div className="lg:col-span-2 h-full">
          <RecentActivity />
        </div>
        <div className="h-full">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;