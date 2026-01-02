import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/api";

export function useAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchMe() {
      try {
        const res = await apiGet("/auth/me", { auth: true });

        if (!mounted) return;

        const email = res?.user?.email ?? null;
        const name = res?.user?.name ?? null;

        if (!email) throw new Error("Usuario inválido");

        setUser({ email, name });
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/login", { replace: true });
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchMe();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login", { replace: true });
  };

  return { user, loading, logout };
}