import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';
import { verifyOtpAndLogin } from '../config/http-client/authService';
import useOtpValidation from '../hooks/useOtpValidation';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const validateOtp = useOtpValidation();
  const [errors, setErrors] = useState({ otp: ''});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const validateField = (name, value) => {
    let error = '';

    if (name === 'otp') {
      if (value.trim() === '') {
        error = 'El código de verificación es obligatorio';
      } else {
        const otpError = validateOtp(value);
        if (otpError) error = otpError;
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const sanitizedOtp = DOMPurify.sanitize(otp);

    let validationErrors = {
        otp: sanitizedOtp.trim() === '' ? 'El código de verificación es obligatorio' : '',
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
        const data = await verifyOtpAndLogin(email, sanitizedOtp);

        const userRole = data.role;
        localStorage.setItem('user', JSON.stringify(data));

        if (userRole === 'ROLE_ADMIN') {
            navigate('/date-of-the-day');
        } else if (userRole === 'ROLE_USER') {
            navigate('/');
        } else if (userRole === 'ROLE_WINDOW') {
            navigate('/service-system');
        } else {
            navigate('/');
        }

        Swal.fire('Éxito', 'Inicio de sesión exitoso.', 'success');
        } catch (error) {
        Swal.fire('Error', error || 'Código de verificación incorrecto o expirado.', 'error');
        } finally {
            setIsLoading(false);
        }
    }
  };

  const isFormInvalid = 
  otp.trim() === '' || 
  errors.otp !== '';

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Verificar código de verificación</h2>

          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3">
            <input
                type="text"
                id="otp"
                className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                placeholder="Ingrese su código de verificación"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onBlur={(e) => validateField('otp', e.target.value)}
              />
              {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
            </div>

            <button type="submit" className="btn btn-success w-100" disabled={isLoading || isFormInvalid}>
                {isLoading ? 'Verificando...' : 'Verificar'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <p className="text-muted">
              Volver a <a onClick={() => navigate('/login')} className="link-primary" style={{ cursor: 'pointer' }}>Iniciar sesión.</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
