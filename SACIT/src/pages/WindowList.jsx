import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';
import axios from 'axios';

const ListWindow = () => {
    const API_URL = import.meta.env.VITE_SERVER_URL;

    const [ventanillas, setVentanillas] = useState([]);
    const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedVentanilla, setSelectedVentanilla] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [newAttendantUuid, setNewAttendantUuid] = useState('');

    useEffect(() => {
        fetchVentanillas();
        fetchUsuariosDisponibles();
    }, []);

    const fetchVentanillas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No se encontró un token de autenticación.');
            }

            const response = await axios.get(`${API_URL}/window`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const ventanillasData = response.data.data.map((ventanilla) => ({
                id: ventanilla.id,
                uuid: ventanilla.uuid,
                numero: ventanilla.windowNumber,
                status: ventanilla.status,
                userName: ventanilla.attendant ? `${ventanilla.attendant.name} ${ventanilla.attendant.lastName}` : 'No asignado',
                userEmail: ventanilla.attendant ? ventanilla.attendant.email : 'No asignado',
                attendantUuid: ventanilla.attendant ? ventanilla.attendant.uuid : null,
            }));

            setVentanillas(ventanillasData);
            setError(null);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.warn('No se encontraron ventanillas.');
                setVentanillas([]);
                setError(null);
            } else {
                console.error('Error fetching ventanillas:', error);
                setError('No se pudieron cargar las ventanillas. Por favor, intente de nuevo más tarde.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchUsuariosDisponibles = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No se encontró un token de autenticación.');
            }

            const usersResponse = await axios.get(`${API_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const windowsResponse = await axios.get(`${API_URL}/window`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const assignedUserUuids = windowsResponse.data.data
                .filter(window => window.attendant) 
                .map(window => window.attendant.uuid); 

            const availableUsers = usersResponse.data.filter(user =>
                user.role.role === 'ROLE_WINDOW' && !assignedUserUuids.includes(user.uuid)
            );

            setUsuariosDisponibles(availableUsers);
        } catch (error) {
            console.error('Error fetching usuarios disponibles:', error);
            setUsuariosDisponibles([]);
        }
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
                await axios.delete(`${API_URL}/window/${uuid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                Swal.fire(
                    '¡Eliminado!',
                    'La ventanilla ha sido eliminada.',
                    'success'
                );

                fetchVentanillas(); 
            }
        } catch (error) {
            console.error('Error eliminando ventanilla:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la ventanilla.'
            });
        }
    };

    const handleEditar = (id) => {
        const ventanilla = ventanillas.find((v) => v.id === id);
        setSelectedVentanilla(ventanilla);
        setNewStatus(ventanilla.status);
        setNewAttendantUuid(ventanilla.attendantUuid || '');
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            if (newStatus !== selectedVentanilla.status) {
                const updatedStatusData = { status: newStatus };

                await axios.put(`${API_URL}/window/${selectedVentanilla.uuid}`, updatedStatusData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            if (newAttendantUuid !== selectedVentanilla.attendantUuid) {
                const updatedUserData = { attendantUuid: newAttendantUuid || null };

                await axios.put(`${API_URL}/window/attendant/${selectedVentanilla.uuid}`, updatedUserData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Ventanilla actualizada correctamente.',
            });

            setShowModal(false);
            fetchVentanillas();
        } catch (error) {
            console.error('Error updating ventanilla:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la ventanilla.',
            });
        }
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Ventanillas</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Cargando ventanillas...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Table bordered hover className="bg-white">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>Nº Ventanilla</th>
                                <th style={{ width: '25%' }}>Usuario Encargado</th>
                                <th style={{ width: '25%' }}>Correo</th>
                                <th style={{ width: '15%' }}>Estado</th>
                                <th style={{ width: '25%' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(ventanillas) && ventanillas.length > 0 ? (
                                ventanillas.map((ventanilla) => (
                                    <tr key={ventanilla.id}>
                                        <td>{ventanilla.numero}</td>
                                        <td>{ventanilla.userName}</td>
                                        <td>{ventanilla.userEmail}</td>
                                        <td>{ventanilla.status}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEditar(ventanilla.id)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEliminar(ventanilla.uuid)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">No hay ventanillas disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Ventanilla</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVentanilla && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    <option value="Activa">Activa</option>
                                    <option value="Inactiva">Inactiva</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Usuario Encargado</Form.Label>
                                <Form.Select
                                    value={newAttendantUuid}
                                    onChange={(e) => setNewAttendantUuid(e.target.value)}
                                >
                                    <option value="">No asignado</option>
                                    {usuariosDisponibles.map((usuario) => (
                                        <option key={usuario.uuid} value={usuario.uuid}>
                                            {usuario.name} {usuario.lastName} - {usuario.email}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
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

export default ListWindow;