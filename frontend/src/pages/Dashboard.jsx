import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  Code2,
  Zap,
  Brain,
  Flame,
  Trophy,
  BarChart3,
  Clock,
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/[0.07] transition-colors">
    <div
      className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-sm text-zinc-500 mt-0.5">{label}</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      icon: Trophy,
      label: "Problems Solved",
      value: user?.stats?.totalSolved ?? 0,
      color: "bg-violet-600",
    },
    {
      icon: BarChart3,
      label: "Total Submissions",
      value: user?.stats?.totalSubmissions ?? 0,
      color: "bg-blue-600",
    },
    {
      icon: Brain,
      label: "AI Reviews Used",
      value: user?.stats?.aiReviewsUsed ?? 0,
      color: "bg-emerald-600",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${user?.stats?.currentStreak ?? 0}d`,
      color: "bg-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 pb-12">
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <div className="flex items-center gap-4 mb-10">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500/30"
              alt={user.name}
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-violet-700 flex items-center justify-center text-xl font-bold text-white ring-2 ring-violet-500/30">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-zinc-500 text-sm">
              {user?.stats?.currentStreak > 0
                ? `🔥 ${user.stats.currentStreak} day streak — keep it going!`
                : "Start your streak today!"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/compiler"
              className="group bg-white/5 border border-white/10 hover:border-violet-500/30 rounded-xl p-6 flex items-center gap-4 transition-all"
            >
              <div className="w-12 h-12 bg-violet-600/20 rounded-xl flex items-center justify-center group-hover:bg-violet-600/30 transition-colors">
                <Code2 className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <div className="text-white font-medium">Open Compiler</div>
                <div className="text-zinc-500 text-sm">
                  Write and run C++ code
                </div>
              </div>
            </Link>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 opacity-60 cursor-not-allowed">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-white font-medium flex items-center gap-2">
                  Practice Problems
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    Soon
                  </span>
                </div>
                <div className="text-zinc-500 text-sm">
                  Solve DSA challenges
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress breakdown */}
        <div>
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">
            Problem Breakdown
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="grid grid-cols-3 gap-6">
              {[
                {
                  label: "Easy",
                  value: user?.stats?.easySolved ?? 0,
                  color: "bg-emerald-500",
                },
                {
                  label: "Medium",
                  value: user?.stats?.mediumSolved ?? 0,
                  color: "bg-yellow-500",
                },
                {
                  label: "Hard",
                  value: user?.stats?.hardSolved ?? 0,
                  color: "bg-red-500",
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div
                    className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-2`}
                  />
                  <div className="text-2xl font-bold text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-zinc-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
