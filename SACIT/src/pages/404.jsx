import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center p-5 rounded-4">
        <img
          src="https://i.imgur.com/qIufhof.png"
          alt="404"
          className="img-fluid mb-4"
          style={{ maxWidth: "300px" }}
        />
        <h1 className="display-1 text-danger fw-bold">404</h1>
        <h2 className="mb-3">¡Vaya! Página no encontrada</h2>
        <p className="text-muted">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" className="btn btn-primary btn-lg mt-3">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;