
const StaffDashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">My Workspace</h1>
        <p className="text-gray-500">Track and manage your document submissions.</p>
      </div>

      {/* 1. Personal Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">My Uploads</p>
          <h4 className="text-3xl font-bold text-blue-600 mt-2">24</h4>
          <p className="text-xs text-green-600 mt-1">↑ 2 this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Pending Review</p>
          <h4 className="text-3xl font-bold text-orange-500 mt-2">3</h4>
          <p className="text-xs text-gray-400 mt-1">Waiting for Admin</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium">Returned / Rejected</p>
          <h4 className="text-3xl font-bold text-red-500 mt-2">1</h4>
          <p className="text-xs text-red-400 mt-1">Action Required</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Main Action Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Upload</h3>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              ☁️
            </div>
            <p className="text-gray-600 font-medium">Click to upload or drag documents here</p>
            <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX (Max 25MB)</p>
          </div>
        </div>

        {/* 3. Recent Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Notifications</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700"><span className="font-semibold">Admin (Region 1)</span> approved your file "Budget_2025.pdf"</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
              <div>
                <p className="text-sm text-gray-700"><span className="font-semibold">System</span> rejected "Invalid_Format.exe"</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;