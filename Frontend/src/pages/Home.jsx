import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

      <div className="test-btns">
        <button className="chat-btn" onClick={() => navigate("/chat")}>
          Ir al Chat IA
        </button>

        <button className="logout-btn" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}