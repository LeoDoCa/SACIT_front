import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmailValidation from '../hooks/useEmailValidation.jsx';
import usePasswordValidation from '../hooks/usePasswordValidation.jsx';
import useConfirmPasswordValidation from '../hooks/useConfirmPasswordValidation.jsx';
import useTextFieldValidation from '../hooks/useTextFieldValidation.jsx';
import { register } from '../config/http-client/authService';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar.jsx';

const RegisterUser = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    rol: 'ventanilla',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    rol: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const validateEmail = useEmailValidation();
  const validatePassword = usePasswordValidation();
  const [confirmPasswordError, validateConfirmPassword] = useConfirmPasswordValidation(formData.contrasena);
  const validateTextField = useTextFieldValidation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'contrasena' || name === 'confirmarContrasena') {
      const otherField = name === 'contrasena' ? 'confirmarContrasena' : 'contrasena';
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmarContrasena: formData[otherField] !== value ? 'Las contraseñas no coinciden.' : '',
      }));
    }
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'nombre' || name === 'apellidos') {
      error = validateTextField(value);
    }

    if (name === 'correo') {
      error = validateEmail(value);
    }

    if (name === 'contrasena') {
      error = validatePassword(value);
    }

    if (name === 'confirmarContrasena') {
      validateConfirmPassword(value);
      error = confirmPasswordError;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedData = {
      name: DOMPurify.sanitize(formData.nombre),
      lastName: DOMPurify.sanitize(formData.apellidos),
      email: DOMPurify.sanitize(formData.correo),
      password: DOMPurify.sanitize(formData.contrasena),
      role: { role: formData.rol === 'ventanilla' ? 'ROLE_WINDOW' : 'ROLE_ADMIN' },
    };

    let validationErrors = {
      name: sanitizedData.name.trim() === '' ? 'El nombre es obligatorio' : '',
      lastName: sanitizedData.lastName.trim() === '' ? 'El apellido es obligatorio' : '',
      email: sanitizedData.email.trim() === '' ? 'El correo es obligatorio' : validateEmail(sanitizedData.email),
      password: sanitizedData.password.trim() === '' ? 'La contraseña es obligatoria' : validatePassword(sanitizedData.password),
      confirmarContrasena: sanitizedData.password !== formData.confirmarContrasena ? 'Las contraseñas no coinciden' : '',
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((err) => err !== '')) {
      Swal.fire({
        title: '¡Error!',
        text: 'Por favor, corrige los errores en el formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    } else {
      setIsLoading(true);

      try {
        const token = localStorage.getItem('accessToken');

        await register(sanitizedData, token);

        Swal.fire({
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });

        // Limpiar los campos del formulario después del registro exitoso
        setFormData({
          nombre: '',
          apellidos: '',
          correo: '',
          rol: 'ventanilla',
          contrasena: '',
          confirmarContrasena: '',
        });
        setErrors({});
      } catch (error) {
        console.error('Error en el registro:', error.response?.data || error.message);
        Swal.fire('Error', error.response?.data?.message || 'Error al crear la cuenta', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      apellidos: '',
      correo: '',
      rol: 'ventanilla',
      contrasena: '',
      confirmarContrasena: '',
    });
    setErrors({});
  };

  return (
    <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
      <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
        <Sidebar />
      </div>

      <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
        <h2 className="mb-4">Registrar Usuario</h2>

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={(e) => validateField('nombre', e.target.value)}
                  required
                  isInvalid={!!errors.nombre}
                />
                <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  onBlur={(e) => validateField('apellidos', e.target.value)}
                  required
                  isInvalid={!!errors.apellidos}
                />
                <Form.Control.Feedback type="invalid">{errors.apellidos}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="correo@ejemplo.com"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={(e) => validateField('correo', e.target.value)}
                  required
                  isInvalid={!!errors.correo}
                />
                <Form.Control.Feedback type="invalid">{errors.correo}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  onBlur={(e) => validateField('rol', e.target.value)}
                  isInvalid={!!errors.rol}
                >
                  <option value="ventanilla">Ventanilla</option>
                  <option value="administrador">Administrador</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">{errors.rol}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese contraseña"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  onBlur={(e) => validateField('contrasena', e.target.value)}
                  required
                  isInvalid={!!errors.contrasena}
                />
                <Form.Control.Feedback type="invalid">{errors.contrasena}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirme contraseña"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  onBlur={(e) => validateField('confirmarContrasena', e.target.value)}
                  required
                  isInvalid={!!errors.confirmarContrasena}
                />
                <Form.Control.Feedback type="invalid">{errors.confirmarContrasena}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" className="me-2" onClick={handleCancel} disabled={isLoading}> 
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Procesando...
                </>
              ) : (
                'Registrar Usuario'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default RegisterUser;