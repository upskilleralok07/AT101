
const MetricCard = ({ title, value, subtext, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'text-blue-600 bg-blue-50 border-blue-100',
    green: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    purple: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    rose: 'text-rose-600 bg-rose-50 border-rose-100',
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-card p-6 shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between">
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{title}</span>
        <div>
          <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{value}</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">{subtext}</p>
        </div>
      </div>

      <div className={`p-3 rounded-2xl border ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default MetricCard;
