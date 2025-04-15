import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="text-center p-5 rounded-4">
        <img
          src="https://i.imgur.com/oCkEbrA.png"
          alt="500"
          className="img-fluid mb-4"
          style={{ maxWidth: "300px" }}
        />
        <h1 className="display-1 text-warning fw-bold">500</h1>
        <h2 className="mb-3">¡Ups! Algo salió mal</h2>
        <p className="text-muted">
          Parece que tuvimos un problema en nuestro servidor. Intenta de nuevo más tarde.
        </p>
        <Link to="/" className="btn btn-outline-primary btn-lg mt-3">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
