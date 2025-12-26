
const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Regional Overview (Region 1)</h1>
        <p className="text-gray-500">Monitor team productivity and document compliance.</p>
      </div>

      {/* 1. Admin Specific Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 p-6 rounded-xl shadow-lg shadow-blue-200 text-white">
          <p className="text-blue-100 text-sm font-medium">Pending Approvals</p>
          <h4 className="text-3xl font-bold mt-2">12</h4>
          <button className="mt-4 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors">Review Now →</button>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Active Staff</p>
          <h4 className="text-2xl font-bold text-gray-800 mt-2">8/10</h4>
          <p className="text-xs text-green-600 mt-1">Online now</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Compliance Rate</p>
          <h4 className="text-2xl font-bold text-gray-800 mt-2">94%</h4>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Total Docs</p>
          <h4 className="text-2xl font-bold text-gray-800 mt-2">1,204</h4>
        </div>
      </div>

      {/* 2. Approval Queue (The main job of an Admin) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Documents Waiting for Approval</h3>
          <button className="text-sm text-blue-600 font-medium">View All</button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-6 py-3">Document</th>
              <th className="px-6 py-3">Submitted By</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="px-6 py-4 font-medium">Q4_Financial_Report.pdf</td>
              <td className="px-6 py-4">Ana Reyes (Staff)</td>
              <td className="px-6 py-4 text-gray-500">Today, 10:00 AM</td>
              <td className="px-6 py-4 text-right gap-2">
                <button className="text-green-600 font-medium hover:underline mr-3">Approve</button>
                <button className="text-red-500 hover:underline">Reject</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Meeting_Minutes_Dec.docx</td>
              <td className="px-6 py-4">John Garcia (Staff)</td>
              <td className="px-6 py-4 text-gray-500">Yesterday</td>
              <td className="px-6 py-4 text-right gap-2">
                <button className="text-green-600 font-medium hover:underline mr-3">Approve</button>
                <button className="text-red-500 hover:underline">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;