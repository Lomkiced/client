const StatsCard = ({ title, value, icon, trend, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
        <span className={`text-xs font-medium px-2 py-1 rounded-full mt-2 inline-block ${
          trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend === 'up' ? '↑' : '↓'} Updated just now
        </span>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatsCard;