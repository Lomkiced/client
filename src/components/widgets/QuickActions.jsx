
const QuickActions = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all border border-blue-100">
          <span className="text-2xl mb-2">📄</span>
          <span className="text-sm font-medium">New Record</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all border border-purple-100">
          <span className="text-2xl mb-2">📤</span>
          <span className="text-sm font-medium">Upload File</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-all border border-green-100">
          <span className="text-2xl mb-2">👥</span>
          <span className="text-sm font-medium">Add User</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-all border border-orange-100">
          <span className="text-2xl mb-2">📊</span>
          <span className="text-sm font-medium">Gen Report</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;