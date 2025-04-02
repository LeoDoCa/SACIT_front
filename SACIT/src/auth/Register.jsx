import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { validateEmail } = useEmailValidation();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name, value) => {
    let error = '';

    if (name === 'firstName' && value.trim() === '') {
      error = 'El nombre es obligatorio';
    }

    if (name === 'lastName' && value.trim() === '') {
      error = 'El apellido es obligatorio';
    }

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

    if (name === 'confirmPassword') {
      if (value.trim() === '') {
        error = 'La confirmación de contraseña es obligatoria';
      } else if (value !== password) {
        error = 'Las contraseñas no coinciden';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleRegister = (e) => {
    e.preventDefault();

    let validationErrors = {
      firstName: firstName.trim() === '' ? 'El nombre es obligatorio' : '',
      lastName: lastName.trim() === '' ? 'El apellido es obligatorio' : '',
      email: email.trim() === '' ? 'El correo es obligatorio' : validateEmail(email).email || '',
      password: password.trim() === '' ? 'La contraseña es obligatoria' : '',
      confirmPassword:
        confirmPassword.trim() === ''
          ? 'La confirmación de contraseña es obligatoria'
          : confirmPassword !== password
          ? 'Las contraseñas no coinciden'
          : '',
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).every((err) => err === '')) {
      console.log('Nombre:', firstName);
      console.log('Apellido:', lastName);
      console.log('Correo:', email);
      console.log('Contraseña:', password);

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
                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                placeholder="Ingrese su nombre"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={(e) => validateField('firstName', e.target.value)}
              />
              {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
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

            <button type="submit" className="btn btn-primary w-100">
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
