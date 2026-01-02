import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { apiPost, apiGet } from "../../api/api";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const signupUser = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      // Signup
      await apiPost("/auth/signup", {
        name: trimmedName,
        email: trimmedEmail,
        password,
      });

      // Login
      try {
        const loginRes = await apiPost("/auth/login", {
          email: trimmedEmail,
          password,
        });

        // backend retorna { access_token }
        const token = loginRes.access_token;
        if (!token) throw new Error('Token no recibido');
        localStorage.setItem("token", token);

        // Obtener el perfil del usuario y almacenar solo el nombre proporcionado por el backend
        try {
          const me = await apiGet('/auth/me', { auth: true });
          const nameFromBackend = me?.user?.name ?? null;
          if (nameFromBackend) localStorage.setItem('name', nameFromBackend);
        } catch (e) {
          // ignorar si falla
        }

        navigate("/");
      } catch {
        setSuccess("Usuario creado. Por favor inicia sesión.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(
        err?.body?.detail ||
        err?.response?.data?.detail ||
        err?.message ||
        "Error al registrar usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-login">
      <div className="auth-form">
        <div className="auth-title">
          <h2>Registro</h2>
        </div>

        <form onSubmit={signupUser}>
          <div className="auth-imputs">
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-extra">
            <span>¿Ya tienes cuenta?</span>
            <button
              type="button"
              className="signup-btn"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </div>

          <div className="auth-button">
            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message success">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;