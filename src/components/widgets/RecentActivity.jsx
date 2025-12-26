
// 1. Mock Data (Later, this will come from your Postgres Database)
const MOCK_ACTIVITIES = [
  { id: 1, user: 'Admin User', action: 'UPLOAD', target: 'DOST_Region1_Report.pdf', time: '2 mins ago' },
  { id: 2, user: 'Staff Member', action: 'EDIT', target: 'Employee_Records_2025.xlsx', time: '1 hour ago' },
  { id: 3, user: 'System', action: 'BACKUP', target: 'Daily Database Backup', time: '5 hours ago' },
  { id: 4, user: 'HR Manager', action: 'DELETE', target: 'Old_Memo_Draft.docx', time: '1 day ago' },
  { id: 5, user: 'Admin User', action: 'LOGIN', target: 'System Access', time: '1 day ago' },
];

// 2. Helper to get styles based on action type
const getActionStyle = (action) => {
  switch (action) {
    case 'UPLOAD': return { color: 'text-blue-600', bg: 'bg-blue-100', icon: '⬆️' };
    case 'DELETE': return { color: 'text-red-600', bg: 'bg-red-100', icon: '🗑️' };
    case 'EDIT': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '✏️' };
    case 'BACKUP': return { color: 'text-green-600', bg: 'bg-green-100', icon: '💾' };
    default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: '👤' };
  }
};

// 3. Main Component
const RecentActivity = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-gray-800">Recent Activity</h3>
        <button className="text-sm text-blue-600 hover:underline">View All</button>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <ul className="space-y-4">
          {MOCK_ACTIVITIES.map((activity) => {
            const style = getActionStyle(activity.action);
            
            return (
              <li key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${style.bg}`}>
                  <span>{style.icon}</span>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>
                    <span className="text-gray-500"> {activity.action.toLowerCase()}ed </span>
                    <span className="font-medium text-gray-700">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Optional: Simple Footer or Empty State check could go here */}
    </div>
  );
};

// 4. CRITICAL: This fixes your "Uncaught SyntaxError"
export default RecentActivity;