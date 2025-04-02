import React, { useState } from 'react';
import useEmailValidation from '../hooks/useEmailValidation';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const { validateEmail } = useEmailValidation();
  const [errors, setErrors] = useState({email: ''});
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
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    }

  const handleResetPassword = (e) => {
    e.preventDefault();

    let validationErrors = {};
    validationErrors.email = email.trim() === '' ? 'El correo es obligatorio' : validateEmail(email).email || '';
    setErrors(validationErrors);
    if (!validationErrors.email ) { 
        navigate('/');
    }
    if (Object.keys(validationErrors).length === 0) {
      console.log("Correo enviado para restablecer la contraseña a:", email);

    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Restablecer contraseña</h2>

          <form onSubmit={handleResetPassword}>
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
                required
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Enviar solicitud
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
