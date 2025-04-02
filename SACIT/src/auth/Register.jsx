import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { errors, validateEmail } = useEmailValidation();
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const validationErrors = validateEmail(email);
    if (Object.keys(validationErrors).length === 0) {
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
      
      console.log("Nombre:", firstName);
      console.log("Apellido:", lastName);
      console.log("Correo:", email);
      console.log("Contraseña:", password);
      

      navigate('/login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Registrarse</h2>

          <form onSubmit={handleRegister}>

            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Nombre(s)</label>
              <input
                type="text"
                id="firstName"
                className="form-control"
                placeholder="Ingrese su nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Apellido(s)</label>
              <input
                type="text"
                id="lastName"
                className="form-control"
                placeholder="Ingrese su apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Registrarse
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted">
              ¿Ya tienes una cuenta? <a href="/login" className="link-primary">Inicia sesión.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
