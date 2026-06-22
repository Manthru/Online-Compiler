import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { User, Lock, Camera } from "lucide-react";

const Profile = () => {
  const { user, login } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || "",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    if (password && password !== confirmPassword) {
      return setMsg({ type: "error", text: "Passwords do not match" });
    }
    setLoading(true);
    try {
      const payload = { name, profilePicture };
      if (password) payload.password = password;
      const { data } = await API.put("/api/user/profile", payload);
      const token = localStorage.getItem("algou_token");
      login({ ...user, ...data }, token);
      setPassword("");
      setConfirmPassword("");
      setMsg({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

        {/* Avatar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6 flex items-center gap-5">
          <div className="relative">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                className="w-20 h-20 rounded-full object-cover"
                alt={user.name}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-violet-700 flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <div className="text-white font-medium text-lg">{user?.name}</div>
            <div className="text-zinc-500 text-sm">{user?.email}</div>
            <div className="text-xs text-zinc-600 mt-1 capitalize">
              {user?.role} account
            </div>
          </div>
        </div>

        <form
          onSubmit={handleUpdate}
          className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-5"
        >
          {msg.text && (
            <div
              className={`px-4 py-3 rounded-lg text-sm ${
                msg.type === "success"
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {msg.text}
            </div>
          )}

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
            />
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm text-zinc-500 mb-4">
              Change Password (leave blank to keep current)
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors text-sm"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
