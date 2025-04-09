import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';

import useTextFieldValidation from '../hooks/useTextFieldValidation';
import useEmailValidation from '../hooks/useEmailValidation';
import usePasswordValidation from '../hooks/usePasswordValidation';
import useConfirmPasswordValidation from '../hooks/useConfirmPasswordValidation';

import DOMPurify from 'dompurify';

const ListaUsuarios = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        rol: 'Ventanilla',
        contrasena: '',
        confirmarContrasena: ''
    });

    const [errors, setErrors] = useState({});

    const validateNombre = useTextFieldValidation(formData.nombre, 'nombre', setErrors);
    const validateApellido = useTextFieldValidation(formData.apellido, 'apellido', setErrors);
    const validateCorreo = useEmailValidation(formData.correo, 'correo', setErrors);
    const validateContrasena = usePasswordValidation(formData.contrasena, 'contrasena', setErrors);
    const [confirmPasswordError, validateConfirmarContrasena] = useConfirmPasswordValidation(formData.contrasena);

    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Alan', apellido: 'Yagami', correo: '20223tn046@utez.edu.mx', rol: 'Ventanilla', contrasena: '' },
        { id: 2, nombre: 'Alan', apellido: 'Yagami', correo: '20223tn046@utez.edu.mx', rol: 'Administrador', contrasena: '' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const handleEditar = (id) => {
        const usuario = usuarios.find((u) => u.id === id);
        setSelectedUsuario(usuario);
        setFormData({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            rol: usuario.rol,
            contrasena: usuario.contrasena,
            confirmarContrasena: usuario.contrasena
        });
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        if (validateForm()) {
            setUsuarios(usuarios.map((usuario) =>
                usuario.id === selectedUsuario.id ? { ...usuario, ...formData } : usuario
            ));
            setShowModal(false);
            setSelectedUsuario(null); // Clear selected user after save
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, corrige los errores antes de guardar.',
            });
        }
    };

    const handleChange = (e, field) => {
        const value = DOMPurify.sanitize(e.target.value);
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Verifica la confirmación de contraseña si es necesario
        if (field === 'contrasena' || field === 'confirmarContrasena') {
            validateConfirmarContrasena(formData.confirmarContrasena);
        }

        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (newErrors[field]) {
                delete newErrors[field];
            }
            return newErrors;
        });
    };

    const validateForm = () => {
        let newErrors = {};
    
        const nameError = validateNombre(formData.nombre);
        if (nameError) newErrors.nombre = nameError;
    
        const lastNameError = validateApellido(formData.apellido);
        if (lastNameError) newErrors.apellido = lastNameError;
    
        const emailError = validateCorreo(formData.correo);
        if (emailError) newErrors.correo = emailError;
    
        const passwordError = validateContrasena(formData.contrasena);
        if (passwordError) newErrors.contrasena = passwordError;
    
        if (formData.contrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEliminar = (id) => {
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    };

    const handleCancel = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se cancelarán todos los cambios realizados.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, volver'
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({
                    nombre: '',
                    apellido: '',
                    correo: '',
                    rol: 'Ventanilla',
                    contrasena: '',
                    confirmarContrasena: ''
                });
                setErrors({});
                setShowModal(false);
            }
        });
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Usuarios</h2>

                <Table bordered hover className="bg-white">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Nombre(s)</th>
                            <th style={{ width: '20%' }}>Apellido(s)</th>
                            <th style={{ width: '30%' }}>Correo</th>
                            <th style={{ width: '10%' }}>Rol</th>
                            <th style={{ width: '20%' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.correo}</td>
                                <td>{usuario.rol}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(usuario.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleEliminar(usuario.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUsuario && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                    isInvalid={!!errors.nombre}  // Muestra error si hay
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) => handleChange(e, 'apellido')}
                                    isInvalid={!!errors.apellido}  // Muestra error si hay
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellido}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={formData.correo}
                                    onChange={(e) => handleChange(e, 'correo')}
                                    isInvalid={!!errors.correo}  // Muestra error si hay
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.correo}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    value={formData.rol}
                                    onChange={(e) => handleChange(e, 'rol')}
                                    isInvalid={!!errors.rol}  // Muestra error si hay
                                >
                                    <option value="Ventanilla">Ventanilla</option>
                                    <option value="Administrador">Administrador</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    {errors.rol}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.contrasena}
                                    onChange={(e) => handleChange(e, 'contrasena')}
                                    isInvalid={!!errors.contrasena}  // Muestra error si hay
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contrasena}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.confirmarContrasena}
                                    onChange={(e) => handleChange(e, 'confirmarContrasena')}
                                    isInvalid={!!errors.confirmarContrasena}  // Muestra error si hay
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmarContrasena}  {/* Mensaje de error */}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListaUsuarios;
