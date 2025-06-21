import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../assets/logo.jpg";

const Login = () => {
  const [username, setUsername] = useState(""); // Cambio de "usuario" a "username"
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // Cambio de "usuario" a "username"
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token); // Guarda el token
        navigate("/principal"); // Redirige a la página principal
      } else {
        alert(data.message || "Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error en el login:", error);
      alert("Hubo un problema con el servidor");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>TWH INNOVACIONES SAC</h2>
        <h1>SISTEMA INTEGRADO DE GESTION</h1>
      </div>
      <div className="login-right">
        <img src={logo} alt="Logo" className="login-logo" />
        
        <form onSubmit={handleLogin}> {/* Formulario para manejar el submit */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Usuario"
              value={username} // Cambio de "usuario" a "username"
              onChange={(e) => setUsername(e.target.value)} // Cambio de "setUsuario" a "setUsername"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember-me">
    <label className="switch">
        <input type="checkbox" id="remember" />
        <span className="slider round"></span>
    </label>
    <span>Recordar usuario</span>
</div>

          <button type="submit" className="login-button">Ingresar</button>
        </form>

      </div>
    </div>
  );
};

export default Login;
