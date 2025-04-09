import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';
import usePasswordValidation from '../hooks/usePasswordValidation';
import useConfirmPasswordValidation from '../hooks/useConfirmPasswordValidation';
import useTextFieldValidation from '../hooks/useTextFieldValidation';
import { register } from '../config/http-client/authService';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const validateEmail = useEmailValidation();
  const validatePassword = usePasswordValidation();
  const [confirmPasswordError, validateConfirmPassword] = useConfirmPasswordValidation(password);
  const validateTextField = useTextFieldValidation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name, value) => {
    let error = '';

    if (name === 'name') {
      error = validateTextField(value);
    }

    if (name === 'lastName') {
      error = validateTextField(value);
    }

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

    if (name === 'confirmPassword') {
      validateConfirmPassword(value);
      error = confirmPasswordError;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
  
    const sanitizedName = DOMPurify.sanitize(name);
    const sanitizedLastName = DOMPurify.sanitize(lastName);
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPassword = DOMPurify.sanitize(password);
    const sanitizedConfirmPassword = DOMPurify.sanitize(confirmPassword);
  
    let validationErrors = {
      name: sanitizedName.trim() === '' ? 'El nombre es obligatorio' : '',
      lastName: sanitizedLastName.trim() === '' ? 'El apellido es obligatorio' : '',
      email: sanitizedEmail.trim() === '' ? 'El correo es obligatorio' : validateEmail(sanitizedEmail),
      password: sanitizedPassword.trim() === '' ? 'La contraseña es obligatoria' : validatePassword(sanitizedPassword),
      confirmPassword: sanitizedConfirmPassword.trim() === '' ? 'La confirmación de la contraseña es obligatoria' : confirmPasswordError,
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
        await register({
          name: sanitizedName,
          lastName: sanitizedLastName,
          email: sanitizedEmail,
          password: sanitizedPassword
        });
  
        Swal.fire({
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada correctamente',
          icon: 'success',
          confirmButtonText: 'Iniciar sesión'
        }).then(() => {
          navigate('/login');
        });
      } catch (error) {
        Swal.fire('Error', error.message || 'Error al crear la cuenta', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h2 className="text-center mb-4">Registrarse</h2>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nombre(s)</label>
              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Ingrese su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => validateField('name', e.target.value)}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Apellido(s)</label>
              <input
                type="text"
                id="lastName"
                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                placeholder="Ingrese su apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={(e) => validateField('lastName', e.target.value)}
              />
              {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
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
                onBlur={(e) => validateField('email', e.target.value)}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
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

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                placeholder="Confirme su contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={(e) => validateField('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                'Registrarse'
              )}
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
