import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import axios from 'axios';

import useTextFieldValidation from '../hooks/useTextFieldValidation';
import useEmailValidation from '../hooks/useEmailValidation';
import usePasswordValidation from '../hooks/usePasswordValidation';
import useConfirmPasswordValidation from '../hooks/useConfirmPasswordValidation';

import DOMPurify from 'dompurify';

const AdminUsersList = () => {
    const API_URL = import.meta.env.VITE_SERVER_URL;

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        email: '',
        password: '',
        confirmarContrasena: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [adminUsers, setAdminUsers] = useState([]);

    const validateNombre = useTextFieldValidation(formData.name, 'name', setErrors);
    const validateApellido = useTextFieldValidation(formData.lastName, 'lastName', setErrors);
    const validateCorreo = useEmailValidation(formData.email, 'email', setErrors);
    const validateContrasena = usePasswordValidation(formData.password, 'password', setErrors);
    const [confirmPasswordError, validateConfirmarContrasena] = useConfirmPasswordValidation(formData.password);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchAdminUsers();
    }, []);

    const fetchAdminUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const adminOnlyUsers = response.data.filter(user => user.role.role === 'ROLE_ADMIN');
            setAdminUsers(adminOnlyUsers);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión expirada',
                    text: 'Por favor, inicia sesión nuevamente.',
                }).then(() => {
                    window.location.href = '/login';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los administradores.',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (uuid) => {
        const user = adminUsers.find((u) => u.uuid === uuid);
        setSelectedUser(user);
        setFormData({
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            password: '',
            confirmarContrasena: ''
        });
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        if (validateForm()) {
            try {
                const token = localStorage.getItem('accessToken');
                const userData = {
                    name: formData.name,
                    lastName: formData.lastName,
                };

                if (formData.password) {
                    userData.password = formData.password;
                }

                await axios.put(`${API_URL}/user/${selectedUser.uuid}`, userData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Administrador actualizado correctamente.',
                });

                setShowModal(false);
                setSelectedUser(null);
                fetchAdminUsers();
            } catch (error) {
                console.error('Error updating admin.');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el administrador. Verifica los datos e inténtalo de nuevo.',
                });
            }
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

        if (field === 'password' || field === 'confirmarContrasena') {
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

        if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio.';

        if (formData.password) {
            if (formData.password.length < 6) {
                newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
            }
            if (formData.password !== formData.confirmarContrasena) {
                newErrors.confirmarContrasena = 'Las contraseñas no coinciden.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEliminar = async (uuid) => {
        try {
            const token = localStorage.getItem('accessToken');
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: "Esta acción no se puede revertir",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await axios.delete(`${API_URL}/user/${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                Swal.fire(
                    '¡Eliminado!',
                    'El administrador ha sido eliminado.',
                    'success'
                );

                fetchAdminUsers();
            }
        } catch (error) {
            console.error('Error deleting admin');
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar el administrador.'
            });
        }
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
                    name: '',
                    lastName: '',
                    email: '',
                    password: '',
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
                <h2 className="mb-4">Administradores</h2>

                {loading ? (
                    <div className="text-center">
                        <p>Cargando administradores...</p>
                    </div>
                ) : (
                    <Table bordered hover className="bg-white">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>Nombre(s)</th>
                                <th style={{ width: '20%' }}>Apellido(s)</th>
                                <th style={{ width: '40%' }}>Correo</th>
                                <th style={{ width: '20%' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsers.length > 0 ? (
                                adminUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEditar(user.uuid)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEliminar(user.uuid)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay administradores disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Administrador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleChange(e, 'name')}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleChange(e, 'lastName')}
                                    isInvalid={!!errors.lastName}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.lastName}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña (opcional)</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange(e, 'password')}
                                    isInvalid={!!errors.password}
                                    placeholder="Nueva contraseña (opcional)"
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>

                            {formData.password && (
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirmar Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={formData.confirmarContrasena}
                                        onChange={(e) => handleChange(e, 'confirmarContrasena')}
                                        isInvalid={!!errors.confirmarContrasena}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.confirmarContrasena}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}
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

export default AdminUsersList;