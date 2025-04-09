import React, { useState } from 'react';
import useEmailValidation from '../hooks/useEmailValidation';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../config/http-client/authService.js';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertCircle, Mail } from 'react-feather';
import DOMPurify from 'dompurify';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const validateEmail = useEmailValidation();
  const [errors, setErrors] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: '', message: '', title: '' });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    if (name === 'email') {
      if (value.trim() === '') {
        error = 'El correo es obligatorio';
      } else {
        error = validateEmail(value) || '';
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const sanitizedEmail = DOMPurify.sanitize(email);

    let validationErrors = {
      email: sanitizedEmail.trim() === '' ? 'El correo es obligatorio' : validateEmail(sanitizedEmail) || ''
    };

    setErrors(validationErrors);

    if (!validationErrors.email) {
      setIsSubmitting(true);
      try {
        await requestPasswordReset(sanitizedEmail);
        setAlert({
          open: true,
          severity: 'success',
          title: 'Solicitud enviada',
          message: 'Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada.'
        });

        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } catch (error) {
        setAlert({
          open: true,
          severity: 'error',
          title: 'Error',
          message: typeof error === 'string' ? error : 'No se pudo enviar la solicitud. Por favor, verifica que tu correo esté registrado e inténtalo nuevamente.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
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

          <div className="alert alert-info d-flex align-items-center mb-3" role="alert">
            <AlertCircle className="me-2" />
            <div>
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </div>
          </div>

          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  id="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => validateField('email', e.target.value)}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                'Enviar solicitud'
              )}
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

export default ResetPassword;
