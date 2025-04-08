import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation';
import { register } from '../config/http-client/authService';
import Swal from 'sweetalert2';

const Register = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { validateEmail } = useEmailValidation();
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

    if (name === 'name' && value.trim() === '') {
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

    if (name === 'password') {
      if (value.trim() === '') {
        error = 'La contraseña es obligatoria';
      } else if (value.length < 8) {
        error = 'La contraseña debe tener al menos 8 caracteres';
      }
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

  const handleRegister = async (e) => {
    e.preventDefault();

    let validationErrors = {
      name: name.trim() === '' ? 'El nombre es obligatorio' : '',
      lastName: lastName.trim() === '' ? 'El apellido es obligatorio' : '',
      email: email.trim() === '' ? 'El correo es obligatorio' : validateEmail(email).email || '',
      password: password.trim() === '' ? 'La contraseña es obligatoria' : 
                password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '',      
      confirmPassword:
        confirmPassword.trim() === ''
          ? 'La confirmación de contraseña es obligatoria'
          : confirmPassword !== password
          ? 'Las contraseñas no coinciden'
          : '',
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).every((err) => err === '')) {
      setIsLoading(true);
      
      try {
        await register({
          name,
          lastName,
          email,
          password
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
              {errors.firstName && <div className="invalid-feedback">{errors.name}</div>}
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
