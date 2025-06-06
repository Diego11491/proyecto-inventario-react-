import { useState } from "react";

const Login = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "1234") {
      onLogin();
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="card-title text-center mb-4">Iniciar sesión</h3>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <button onClick={handleLogin} className="btn btn-primary w-100">
          Ingresar
        </button>
      </div>
    </div>
  );
};

export default Login;
