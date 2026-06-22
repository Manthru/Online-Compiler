import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("algou_token", token);
      API.get("/api/auth/me")
        .then((res) => {
          login(res.data, token);
          navigate("/dashboard");
        })
        .catch(() => navigate("/login"));
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default OAuthSuccess;
