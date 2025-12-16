import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../api/api";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMe = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await apiGet("/auth/me", { auth: true });

        if (!isMounted) return;

        const email = res?.user?.email ?? null;
        const name = res?.user?.name ?? null;

        if (!email) {
          throw new Error("Usuario inválido");
        }

        setUser({ email, name });
      } catch {
        // Token inválido / no autenticado
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate("/login", { replace: true });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMe();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="home-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="home-container">
      <h1>Bienvenido</h1>

      <p>
        Has iniciado sesión como <strong>{user.email}</strong>
      </p>

      {user.name && (
        <p>
          Nombre: <strong>{user.name}</strong>
        </p>
      )}

      <div>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}