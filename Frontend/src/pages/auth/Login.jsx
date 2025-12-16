import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiPost, apiGet } from "../../api/api";
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiPost("/auth/login", { email, password });
      // Backend retorna { access_token }
      const token = res.access_token;
      if (!token) throw new Error("Token no recibido");
      localStorage.setItem("token", token);

      // Obtener el perfil del usuario
      try {
        const me = await apiGet('/auth/me', { auth: true });
        const name = me?.user?.name ?? null;
        if (name) localStorage.setItem('name', name);
      } catch (e) {
        // ignorar si falla
      }

      navigate("/");
    } catch (err) {
      setError(err.body?.detail || err.message || "Error al iniciar sesión");
    }
  };

  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="auth-login">
      <div className="auth-form">
        <div className="auth-title">
          <h2>Iniciar sesión</h2>
        </div>

        <form onSubmit={loginUser}>
          <div className="auth-imputs">
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Correo electrónico" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Contraseña" />
          </div>

          <div className="auth-extra">
            <span>¿No tienes cuenta?</span>
            <button type="button" onClick={goToSignup} className="signup-btn">Crear cuenta</button>
          </div>

          <div className="auth-button">
            <button type="submit">Entrar</button>
          </div>

          {error && <div className="auth-message error">{error}</div>}

        </form>
      </div>
    </div>
  );
};

export default Login;