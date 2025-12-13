
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

  const navigate = useNavigate();

  const loginUser = () => {
    // TODO: Lógica de autenticación aquí
    console.log("Iniciando sesión...");
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

        <div className="auth-imputs">
          <input type="email" placeholder="Correo electrónico" />
          <input type="password" placeholder="Contraseña" />
        </div>

        <div className="auth-extra">
          <span>¿No tienes cuenta?</span>
          <button onClick={goToSignup} className="signup-btn">Crear cuenta</button>
        </div>

        <div className="auth-button">
          <button onClick={loginUser}>Entrar</button>
        </div>

        {/* <div className="auth-anon">
          <button className="anon-btn">Entrar como anónimo</button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;