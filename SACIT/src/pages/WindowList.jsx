import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const ListWindow = () => {
    const [ventanillas, setVentanillas] = useState([
        { id: 1, numero: 1, nombre: 'Ventanilla1', inicioHorario: '08:00', finHorario: '16:00' },
        { id: 2, numero: 2, nombre: 'Ventanilla2', inicioHorario: '08:00', finHorario: '16:00' },
        { id: 3, numero: 3, nombre: 'Ventanilla3', inicioHorario: '08:00', finHorario: '16:00' },
        { id: 4, numero: 4, nombre: 'Ventanilla4', inicioHorario: '08:00', finHorario: '16:00' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedVentanilla, setSelectedVentanilla] = useState(null);

    const handleEditar = (id) => {
        const ventanilla = ventanillas.find((v) => v.id === id);
        setSelectedVentanilla(ventanilla);
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        setVentanillas(ventanillas.map((ventanilla) =>
            ventanilla.id === selectedVentanilla.id ? selectedVentanilla : ventanilla
        ));
        setShowModal(false);
    };

    const handleChange = (e, field) => {
        setSelectedVentanilla({ ...selectedVentanilla, [field]: e.target.value });
    };

    const handleEliminar = (id) => {
        setVentanillas(ventanillas.filter((ventanilla) => ventanilla.id !== id));
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Ventanillas</h2>

                <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>Nº Ventanilla</th>
                            <th style={{ width: '30%' }}>Nombre</th>
                            <th style={{ width: '20%' }}>Inicio Horario</th>
                            <th style={{ width: '20%' }}>Fin Horario</th>
                            <th style={{ width: '10%' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventanillas.map((ventanilla) => (
                            <tr key={ventanilla.id}>
                                <td>{ventanilla.numero}</td>
                                <td>{ventanilla.nombre}</td>
                                <td>{ventanilla.inicioHorario}</td>
                                <td>{ventanilla.finHorario}</td>
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
                                        onClick={() => handleEliminar(ventanilla.id)}
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
                    <Modal.Title>Editar Ventanilla</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVentanilla && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Número de Ventanilla</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedVentanilla.numero}
                                    onChange={(e) => handleChange(e, 'numero')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedVentanilla.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Inicio de Horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={selectedVentanilla.inicioHorario}
                                    onChange={(e) => handleChange(e, 'inicioHorario')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Fin de Horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={selectedVentanilla.finHorario}
                                    onChange={(e) => handleChange(e, 'finHorario')}
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

export default ListWindow;