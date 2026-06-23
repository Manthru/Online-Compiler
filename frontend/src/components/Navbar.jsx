import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Code2,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Terminal,
  BookOpen,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Code2 className="w-6 h-6 text-violet-400" />
          <span className="font-bold text-white text-lg tracking-tight">
            AlgoU
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">
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
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Problems
              </Link>
              <Link
                to="/compiler"
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <Terminal className="w-4 h-4" />
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

        {/* Mobile — avatar + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          {user && (
            <Link to="/profile">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  className="w-8 h-8 rounded-full object-cover"
                  alt={user.name}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/5 px-4 py-4 space-y-1">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 pb-3 mb-2 border-b border-white/5">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={user.name}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-white font-medium text-sm">
                    {user.name}
                  </div>
                  <div className="text-zinc-500 text-xs">{user.email}</div>
                </div>
              </div>

              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>

              <Link
                to="/problems"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Problems</span>
              </Link>

              <Link
                to="/compiler"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Terminal className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Compiler</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Code2 className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-medium">Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <span className="text-sm font-medium">Login</span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-3 px-3 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
              >
                <span className="text-sm font-medium">Get Started</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
