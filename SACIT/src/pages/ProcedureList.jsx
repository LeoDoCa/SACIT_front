import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';
import DOMPurify from 'dompurify';

const ListaTramites = () => {
    const [tramites, setTramites] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTramite, setSelectedTramite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTramites();
    }, []);

    const fetchTramites = async () => {
        try {
            setLoading(true);

            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró un token de autenticación.');
            }

            const apiUrl = `${import.meta.env.VITE_SERVER_URL}/procedures/`;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            const response = await axios.get(apiUrl, config);
            console.log('Trámites cargados:', response.data); 
            setTramites(Array.isArray(response.data) ? response.data : []); 
            setError(null);
        } catch (err) {
            console.error('Error al cargar los trámites:', err);
            setError('No se pudieron cargar los trámites. Por favor, intente de nuevo más tarde.');
            setTramites([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleEditar = (uuid) => {
        const tramite = tramites.find((t) => t.uuid === uuid); 

        const requiredDocumentsNames = tramite.requieredDocuments
            ? tramite.requieredDocuments.map((doc) => doc.name)
            : [];

        setSelectedTramite({ ...tramite, requiredDocumentsNames }); 
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                throw new Error('No se encontró un token de autenticación.');
            }

            const requieredDocuments = selectedTramite.requiredDocumentsNames.map((name, index) => ({
                id: selectedTramite.requieredDocuments?.[index]?.id || null, // Mantener el ID si existe
                name,
            }));

            const submissionData = {
                ...selectedTramite,
                cost: parseFloat(selectedTramite.cost),
                estimatedTime: parseInt(selectedTramite.estimatedTime, 10),
                requieredDocuments,
            };

            const apiUrl = `${import.meta.env.VITE_SERVER_URL}/procedures/${selectedTramite.uuid}`;

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            await axios.put(apiUrl, submissionData, config);

            setTramites((prevTramites) =>
                prevTramites.map((tramite) =>
                    tramite.uuid === selectedTramite.uuid ? selectedTramite : tramite
                )
            );

            Swal.fire({
                title: '¡Éxito!',
                text: 'Trámite actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'OK',
            });

            setShowModal(false);
        } catch (error) {
            console.error('Error al actualizar el trámite:', error);
            Swal.fire({
                title: 'Error',
                text: `No se pudo actualizar el trámite: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleEliminar = async (uuid) => {
        try {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: 'No podrás revertir esta acción',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar',
            });

            if (result.isConfirmed) {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    throw new Error('No se encontró un token de autenticación.');
                }

                const apiUrl = `${import.meta.env.VITE_SERVER_URL}/procedures/${uuid}`; 

                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                };

                await axios.delete(apiUrl, config);

                setTramites((prevTramites) => prevTramites.filter((t) => t.uuid !== uuid));

                Swal.fire('¡Eliminado!', 'El trámite ha sido eliminado.', 'success');
            }
        } catch (error) {
            console.error('Error al eliminar el trámite:', error);
            Swal.fire({
                title: 'Error',
                text: `No se pudo eliminar el trámite: ${error.response?.data?.message || error.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
    const handleChange = (e, field) => {
        const value = e.target.value;
        const sanitizedValue = field === 'description' || field === 'name' || field === 'requiredDocumentsNames'
            ? DOMPurify.sanitize(value)
            : value;

        setSelectedTramite({ ...selectedTramite, [field]: sanitizedValue });
    };

    const handleDocumentChange = (e, index) => {
        const value = e.target.value;
        const sanitizedValue = DOMPurify.sanitize(value);

        const updatedDocs = [...selectedTramite.requiredDocumentsNames];
        updatedDocs[index] = sanitizedValue;
        setSelectedTramite({ ...selectedTramite, requiredDocumentsNames: updatedDocs });
    };

    const handleAddDocument = () => {
        setSelectedTramite((prev) => ({
            ...prev,
            requiredDocumentsNames: [...(prev.requiredDocumentsNames || []), ''],
        }));
    };

    const handleRemoveDocument = (index) => {
        const updatedDocs = [...selectedTramite.requiredDocumentsNames];
        updatedDocs.splice(index, 1);
        setSelectedTramite({ ...selectedTramite, requiredDocumentsNames: updatedDocs });
    };

    const formatEstimatedTime = (minutes) => {
        if (!minutes && minutes !== 0) return '-';

        if (minutes < 60) {
            return `${minutes} minutos`;
        } else {
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;

            if (remainingMinutes === 0) {
                return hours === 1 ? '1 hora' : `${hours} horas`;
            } else {
                return `${hours}h ${remainingMinutes}m`;
            }
        }
    };

    const formatCost = (cost) => {
        if (!cost && cost !== 0) return '$0.00';
        return `$${parseFloat(cost).toFixed(2)}`;
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Trámites</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Cargando trámites...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Table bordered hover className="bg-white">
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Trámite</th>
                                <th style={{ width: '20%' }}>Costo</th>
                                <th style={{ width: '20%' }}>Tiempo Estimado</th>
                                <th style={{ width: '20%' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(tramites) && tramites.length > 0 ? (
                                tramites.map((tramite) => (
                                    <tr key={tramite.uuid}>
                                        <td>{tramite.name}</td>
                                        <td>{formatCost(tramite.cost)}</td>
                                        <td>{formatEstimatedTime(tramite.estimatedTime)}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleEditar(tramite.uuid)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleEliminar(tramite.uuid)}
                                            >
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">No hay trámites disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Trámite</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTramite && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedTramite.name}
                                    onChange={(e) => handleChange(e, 'name')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedTramite.description}
                                    onChange={(e) => handleChange(e, 'description')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Costo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedTramite.cost}
                                    onChange={(e) => handleChange(e, 'cost')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Tiempo estimado</Form.Label>
                                <Form.Select
                                    value={selectedTramite.estimatedTime}
                                    onChange={(e) => handleChange(e, 'estimatedTime')}
                                >
                                    <option value="15">15 minutos</option>
                                    <option value="30">30 minutos</option>
                                    <option value="45">45 minutos</option>
                                    <option value="60">1 hora</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={selectedTramite.status}
                                    onChange={(e) => handleChange(e, 'status')}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                    <option value="En revisión">En revisión</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <Form.Label className="mb-0">Documentos requeridos</Form.Label>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleAddDocument}
                                    >
                                        + Agregar Documento
                                    </Button>
                                </div>

                                {selectedTramite.requiredDocumentsNames && selectedTramite.requiredDocumentsNames.map((doc, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <Form.Control
                                            type="text"
                                            value={doc}
                                            onChange={(e) => handleDocumentChange(e, index)}
                                            placeholder={`Documento ${index + 1}`}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleRemoveDocument(index)}
                                        >
                                            -
                                        </Button>
                                    </div>
                                ))}
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

export default ListaTramites;
