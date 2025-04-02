import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Sidebar from '../components/Sidebar.jsx';

const RegisterUser = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        correo: '',
        rol: 'ventanilla', // Valor predeterminado
        contrasena: '',
        confirmarContrasena: ''
    });

    const [validated, setValidated] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Verificar coincidencia de contraseñas cuando se cambia alguna de ellas
        if (name === 'contrasena' || name === 'confirmarContrasena') {
            const otherField = name === 'contrasena' ? 'confirmarContrasena' : 'contrasena';
            setPasswordMatch(value === formData[otherField] || value === '' || formData[otherField] === '');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        // Verificar que las contraseñas coincidan
        if (formData.contrasena !== formData.confirmarContrasena) {
            setPasswordMatch(false);
            e.stopPropagation();
            return;
        }

        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            console.log('Datos del usuario:', formData);
            // Aquí iría la lógica para enviar los datos al servidor
        }

        setValidated(true);
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                <h2 className="mb-4">Registrar Usuario</h2>

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un nombre.
                                </Form.Control.Feedback>
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
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese los apellidos.
                                </Form.Control.Feedback>
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
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un correo electrónico válido.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="ventanilla">Ventanilla</option>
                                    <option value="admin">Administrador</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor seleccione un rol.
                                </Form.Control.Feedback>
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
                                    required
                                    isInvalid={!passwordMatch}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {!passwordMatch ? 'Las contraseñas no coinciden.' : 'Por favor ingrese una contraseña.'}
                                </Form.Control.Feedback>
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
                                    required
                                    isInvalid={!passwordMatch}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {!passwordMatch ? 'Las contraseñas no coinciden.' : 'Por favor confirme la contraseña.'}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2">Cancelar</Button>
                        <Button variant="primary" type="submit">Registrar Usuario</Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default RegisterUser;