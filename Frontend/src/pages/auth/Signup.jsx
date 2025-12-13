import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { apiPost } from "../../api/api";

const Signup = () => {

  const navigate = useNavigate();

  const signupUser = () => {
    // TODO: Lógica de registro aquí
    console.log("Registrando usuario...");
  };

  const goToLogin = () => {
    navigate("/login")
  };

  return (
    <div className="auth-login">
      <div className="auth-form">
        <div className="auth-title">
          <h2>Registro</h2>
        </div>

        <form>
          <div className="auth-imputs">
            <input type="email" placeholder="Correo electrónico"/>
            <input type="password" placeholder="Contraseña"/>
          </div>

          <div className="auth-extra">
            <span>¿Ya tienes cuenta?</span>
            <button onClick={goToLogin} className="signup-btn">Iniciar sesión</button>
          </div>
          <div className="auth-button">
            <button onClick={signupUser}>Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;