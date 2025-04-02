import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';
import { login } from '../config/http-client/authService';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { validateEmail } = useEmailValidation();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (value.trim() === '') {
        error = 'El correo es obligatorio';
      } else {
        const emailErrors = validateEmail(value);
        if (emailErrors.email) error = emailErrors.email;
      }
    }

    if (name === 'password' && value.trim() === '') {
      error = 'La contraseña es obligatoria';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    validationErrors.email = email.trim() === '' ? 'El correo es obligatorio' : validateEmail(email).email || '';
    validationErrors.password = password.trim() === '' ? 'La contraseña es obligatoria' : '';

    setErrors(validationErrors);

    if (!validationErrors.email && !validationErrors.password) {
      try {
        const response = await login(email, password);
        localStorage.setItem('user', JSON.stringify(response));

        const userRole = response.role;
        if (userRole === 'ROLE_ADMIN') {
          navigate('/procedure-form'); 
        } else if (userRole === 'ROLE_USER') {
          navigate('/user-dashboard');
        } else if (userRole === 'ROLE_WINDOW') {
          navigate('/window-dashboard');
        } else {
          navigate('/'); 
        }

        Swal.fire('Éxito', 'Inicio de sesión exitoso', 'success');
      } catch (error) {
        Swal.fire('Error', error, 'error'); 
      }
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
                onBlur={(e) => validateField('email', e.target.value)}
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
                onBlur={(e) => validateField('password', e.target.value)}
              />
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Iniciar sesión
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted">
              ¿No tiene una cuenta? <a href="/register" className="link-primary">Cree una.</a>
            </p>
            <p className="text-muted">
              <a href="/reset-password" className="link-primary">¿Olvidaste tu contraseña?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;