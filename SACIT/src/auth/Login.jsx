import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';
import useEmailValidation from '../hooks/useEmailValidation';
import usePasswordValidation from '../hooks/usePasswordValidation';
import BackToHomeButton from '../components/BackToHomeButton';
import { Eye, EyeOff } from 'react-feather';

import { sendOtp, validateCredentials } from '../config/http-client/authService'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [attempts, setAttempts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const validateEmail = useEmailValidation();
  const validatePassword = usePasswordValidation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (value.trim() === '') {
        error = 'El correo es obligatorio';
      } else {
        const emailError = validateEmail(value);
        if (emailError) error = emailError;
      }
    }

    if (name === 'password') {
      if (value.trim() === '') {
        error = 'La contraseña es obligatoria';
      } else {
        const passwordError = validatePassword(value);
        if (passwordError) error = passwordError;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);

    if (attempts[sanitizedEmail]?.blockedUntil > Date.now()) {
      Swal.fire('Bloqueado', 'El correo está bloqueado. Intente nuevamente después de 30 minutos.', 'error');
      return;
    }

    let validationErrors = {
      email: sanitizedEmail.trim() === '' ? 'El correo es obligatorio' : '',
      password: sanitizedPassword.trim() === '' ? 'La contraseña es obligatoria' : '',
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((err) => err !== '')) {
          Swal.fire({
            title: '¡Error!',
            text: 'Por favor, corrige los errores en el formulario.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
    } else {
      setIsLoading(true);
      try {
        await validateCredentials(sanitizedEmail, sanitizedPassword);

        await sendOtp(sanitizedEmail);

        Swal.fire('Éxito', 'Código de verificación enviado a su correo.', 'success');
        navigate('/verify-otp', { state: { email: sanitizedEmail } });
      } catch (error) {
        setAttempts((prevAttempts) => {
          const prevCount = prevAttempts[sanitizedEmail]?.count || 0;
          const newCount = prevCount + 1;

          const updatedAttempts = {
            ...prevAttempts,
            [sanitizedEmail]: {
              count: newCount,
              blockedUntil: newCount >= 3 ? Date.now() + 30 * 60 * 1000 : null,
            },
          };

          if (newCount === 3) {
            Swal.fire('Bloqueado', 'Ha alcanzado el límite de intentos fallidos. Su correo ha sido bloqueado durante 30 minutos.', 'error');
          } else {
            Swal.fire('Error', error || 'Credenciales incorrectas. Intente nuevamente.', 'error');
          }

          return updatedAttempts;
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isFormInvalid = 
  email.trim() === '' || 
  password.trim() === '' || 
  errors.email !== '' || 
  errors.password !== '';

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
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={(e) => validateField('password', e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading || isFormInvalid}
            >
              {isLoading ? 'Enviando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-muted">
              ¿No tiene una cuenta? <a onClick={() => navigate('/register')} className="link-primary" style={{ cursor: 'pointer' }}>Cree una.</a>
            </p>
            <p className="text-muted">
              <a onClick={() => navigate('/reset-password')} className="link-primary" style={{ cursor: 'pointer' }}>¿Olvidaste tu contraseña?</a>
            </p>
          </div>
          <div className="d-flex justify-content-center mt-1">
            <BackToHomeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
