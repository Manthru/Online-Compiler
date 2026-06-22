import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Code2, LogOut, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo — always goes to landing page "/" */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Code2 className="w-6 h-6 text-violet-400" />
          <span className="font-bold text-white text-lg tracking-tight">
            AlgoU
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/problems"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Problems
              </Link>

              <Link
                to="/compiler"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Compiler
              </Link>

              <Link
                to="/profile"
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1.5 transition-all"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    className="w-6 h-6 rounded-full object-cover"
                    alt={user.name}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-white">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
