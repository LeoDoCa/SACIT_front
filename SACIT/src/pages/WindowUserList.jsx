import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import axios from 'axios';


const WindowUsersList = () => {
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
    const [windowUsers, setWindowUsers] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchWindowUsers();
    }, []);

    const fetchWindowUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No se encontró un token de autenticación.');
            }

            const usersResponse = await axios.get(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            let assignedUserUuids = [];

            try {
                const windowsResponse = await axios.get(`${API_URL}/window`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                assignedUserUuids = windowsResponse.data.data
                    .filter(window => window.attendant) 
                    .map(window => window.attendant.uuid);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn('No se encontraron ventanillas. Continuando con los usuarios.');
                } else {
                    throw error; 
                }
            }

            const windowOnlyUsers = usersResponse.data
                .filter(user => user.role.role === 'ROLE_WINDOW')
                .map(user => ({
                    ...user,
                    assignedWindow: assignedUserUuids.includes(user.uuid), 
                }));

            setWindowUsers(windowOnlyUsers);
        } catch (error) {
            console.error('Error fetching window users:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los usuarios de ventanilla.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAsignar = async (uuid) => {
        try {
            const token = localStorage.getItem('accessToken');
            const requestData = {
                attendantUuid: uuid,
            };

            await axios.post(`${API_URL}/window`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Ventanilla creada correctamente.',
            });

            fetchWindowUsers(); 
        } catch (error) {
            console.error('Error al asignar ventanilla:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo asignar la ventanilla.',
            });
        }
    };

    const handleEditar = (uuid) => {
        const user = windowUsers.find((u) => u.uuid === uuid);
        if (!user) {
            console.error('Usuario no encontrado:', uuid);
            return;
        }

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
                    text: 'Usuario de ventanilla actualizado correctamente.',
                });

                setShowModal(false);
                setSelectedUser(null);
                fetchWindowUsers();
            } catch (error) {
                console.error('Error updating window user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo actualizar el usuario de ventanilla. Verifica los datos e inténtalo de nuevo.',
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

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Usuarios de Ventanilla</h2>

                {loading ? (
                    <div className="text-center">
                        <p>Cargando usuarios de ventanilla...</p>
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
                            {windowUsers.length > 0 ? (
                                windowUsers.map((user) => (
                                    <tr key={user.uuid}>
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
                                                className="me-2"
                                                onClick={() => handleEliminar(user.uuid)}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleAsignar(user.uuid)}
                                                disabled={user.assignedWindow} 
                                            >
                                                Asignar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay usuarios de ventanilla disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario de Ventanilla</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                        onChange={(e) => setFormData({ ...formData, confirmarContrasena: e.target.value })}
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
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
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

export default WindowUsersList;