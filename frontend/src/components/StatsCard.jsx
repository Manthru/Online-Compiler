const StatsCard = ({ icon: Icon, label, value, color, sublabel }) => {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200">
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-4`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-white tracking-tight">
        {value}
      </div>

      {/* Label */}
      <div className="text-sm text-zinc-500 mt-0.5">{label}</div>

      {/* Optional sublabel */}
      {sublabel && (
        <div className="text-xs text-zinc-600 mt-2 border-t border-white/5 pt-2">
          {sublabel}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
