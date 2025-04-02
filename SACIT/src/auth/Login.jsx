import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { errors, validateEmail } = useEmailValidation();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const validationErrors = validateEmail(email);
    if (Object.keys(validationErrors).length === 0) {
      console.log("Correo:", email);
      console.log("Contraseña:", password);
        
      navigate('/');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Iniciar sesión</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo</label>
              <input
                type="email"
                id="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Ingrese su correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted">
              ¿No tiene una cuenta? <a href="/register" className="link-primary">Cree una.</a>
            </p>
            <p className="text-muted">
              <a href="/reset-password" className="link-primary">Olvidaste tu contraseña?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
