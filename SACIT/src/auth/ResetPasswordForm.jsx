import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateToken, resetPassword } from '../config/http-client/authService.js';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Eye, EyeOff, AlertTriangle } from 'react-feather';
import styles from '../assets/css/auth/reset-password.module.css';

import usePasswordValidation from '../hooks/usePasswordValidation.jsx';
import useConfirmPasswordValidation from '../hooks/useConfirmPasswordValidation.jsx';
import DOMPurify from 'dompurify';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, severity: '', message: '', title: '' });
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = usePasswordValidation();
  const [confirmPasswordError, validateConfirmPassword] = useConfirmPasswordValidation(formData.password);

  useEffect(() => {
    checkTokenValidity();
  }, [token]);

  const checkTokenValidity = async () => {
    try {
      await validateToken(token);
      setIsTokenValid(true);
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        title: 'Token inválido',
        message: 'El enlace ha expirado o no es válido. Solicita un nuevo correo de recuperación.'
      });
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  
  const validateForm = () => {
    const sanitizedPassword = DOMPurify.sanitize(formData.password);
    const sanitizedConfirmPassword = DOMPurify.sanitize(formData.confirmPassword);
  
    const passwordError = sanitizedPassword.trim() === ''
      ? 'La contraseña es obligatoria'
      : validatePassword(sanitizedPassword);
  
    const confirmPasswordError = sanitizedConfirmPassword.trim() === ''
      ? 'La confirmación de la contraseña es obligatoria'
      : sanitizedConfirmPassword !== sanitizedPassword
        ? 'Las contraseñas no coinciden'
        : '';
  
    const newErrors = {
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };
  
    setErrors(newErrors);
  
    return !Object.values(newErrors).some(error => error !== '');
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password' || name === 'confirmPassword') {
      validateForm();
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await resetPassword(token, DOMPurify.sanitize(formData.password));
      
      setAlert({
        open: true,
        severity: 'success',
        title: 'Contraseña actualizada',
        message: 'Tu contraseña ha sido actualizada correctamente. Redirigiendo al inicio de sesión...'
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setAlert({
        open: true,
        severity: 'error',
        title: 'Error',
        message: typeof error === 'string' ? error : 'Ocurrió un error al actualizar tu contraseña. Inténtalo nuevamente.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: '500px' }}>
          <div className="card p-4 shadow">
            <div className="text-center mb-4">
              <AlertTriangle size={50} className="text-warning mb-3" />
              <h2>Enlace inválido</h2>
            </div>
            
            <Alert severity="error">
              <AlertTitle>Token inválido o expirado</AlertTitle>
              El enlace para restablecer tu contraseña ha expirado o no es válido. 
              Por favor, solicita un nuevo correo de recuperación.
            </Alert>
            
            <div className="text-center mt-4">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Restablecer contraseña</h2>
          
          {alert.open && (
            <Alert 
              severity={alert.severity}
              onClose={() => setAlert({ ...alert, open: false })}
              style={{ marginBottom: '20px' }}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.message}
            </Alert>
          )}
          
          <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
            <div className="me-2">
              <i className="bi bi-info-circle-fill"></i>
            </div>
            <div>
              Crea una nueva contraseña para tu cuenta. Debe tener al menos 8 caracteres.
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Nueva contraseña</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu nueva contraseña"
                  onBlur={validateForm}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu nueva contraseña"
                  onBlur={validateForm}
                />
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn btn-primary w-100 py-2 ${styles['submit-btn']}`}
            >
              Actualizar contraseña
            </button>
          </form>
          
          <div className="mt-3 text-center">
            <p className="text-muted">
              ¿Recuerdas tu contraseña? <a href="/login" className="link-primary">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;