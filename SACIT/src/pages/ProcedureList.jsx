import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const ListaTramites = () => {
    const [tramites, setTramites] = useState([
        { id: 1, nombre: 'Tramite 1', descripcion: 'Descripción 1', costo: '$ 0.00', documentos: ['Doc 1'], datos: ['Dato 1'], duracion: '1 hora' },
        { id: 2, nombre: 'Tramite 2', descripcion: 'Descripción 2', costo: '$ 0.00', documentos: ['Doc 2'], datos: ['Dato 2'], duracion: '2 horas' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedTramite, setSelectedTramite] = useState(null);

    const handleEditar = (id) => {
        const tramite = tramites.find((t) => t.id === id);
        setSelectedTramite(tramite);
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        setTramites(tramites.map((tramite) =>
            tramite.id === selectedTramite.id ? selectedTramite : tramite
        ));
        setShowModal(false);
    };

    const handleChange = (e, field) => {
        setSelectedTramite({ ...selectedTramite, [field]: e.target.value });
    };

    const handleDynamicChange = (e, field, index) => {
        const updatedArray = [...selectedTramite[field]];
        updatedArray[index] = e.target.value;
        setSelectedTramite({ ...selectedTramite, [field]: updatedArray });
    };

    const handleAddField = (field) => {
        setSelectedTramite({ ...selectedTramite, [field]: [...selectedTramite[field], ''] });
    };

    const handleRemoveField = (field, index) => {
        const updatedArray = [...selectedTramite[field]];
        updatedArray.splice(index, 1);
        setSelectedTramite({ ...selectedTramite, [field]: updatedArray });
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Trámites</h2>

                <Table bordered hover className="bg-white">
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>Trámite</th>
                            <th style={{ width: '20%' }}>Costo</th>
                            <th style={{ width: '20%' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tramites.map((tramite) => (
                            <tr key={tramite.id}>
                                <td>{tramite.nombre}</td>
                                <td>{tramite.costo}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(tramite.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => setTramites(tramites.filter((t) => t.id !== tramite.id))}
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
                    <Modal.Title>Editar Trámite</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTramite && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedTramite.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={selectedTramite.descripcion}
                                    onChange={(e) => handleChange(e, 'descripcion')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Costo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedTramite.costo}
                                    onChange={(e) => handleChange(e, 'costo')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Documentos</Form.Label>
                                {selectedTramite.documentos.map((doc, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => {
                                                const updatedArray = [...selectedTramite.documentos];
                                                updatedArray[index] = e.target.files[0]; // Guardar el archivo seleccionado
                                                setSelectedTramite({ ...selectedTramite, documentos: updatedArray });
                                            }}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleRemoveField('documentos', index)}
                                        >
                                            -
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="primary" size="sm" onClick={() => handleAddField('documentos')}>
                                    + Agregar Documento
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Datos</Form.Label>
                                {selectedTramite.datos.map((dato, index) => (
                                    <div key={index} className="d-flex mb-2">
                                        <Form.Control
                                            type="text"
                                            value={dato}
                                            onChange={(e) => handleDynamicChange(e, 'datos', index)}
                                        />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="ms-2"
                                            onClick={() => handleRemoveField('datos', index)}
                                        >
                                            -
                                        </Button>
                                    </div>
                                ))}
                                <Button variant="primary" size="sm" onClick={() => handleAddField('datos')}>
                                    + Agregar Dato
                                </Button>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Duración</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedTramite.duracion}
                                    onChange={(e) => handleChange(e, 'duracion')}
                                />
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