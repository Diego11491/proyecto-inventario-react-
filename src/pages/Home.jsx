import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center p-5 bg-white rounded shadow" style={{ maxWidth: "500px" }}>
        <h1 className="mb-4">Bienvenido al Sistema de Inventario</h1>
        <p className="mb-4">Administra tus productos de forma sencilla y eficiente.</p>
        <Link to="/inventario" className="btn btn-primary btn-lg">
          Ir al Inventario
        </Link>
      </div>
    </div>
  );
};

export default Home;
