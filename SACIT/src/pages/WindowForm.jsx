import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Siderbar';

const AddWindow = () => {
    const [formData, setFormData] = useState({
        numeroVentanilla: '',
        nombre: '',
        inicioHorario: '',
        finHorario: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de la ventanilla:', formData);
    };

    const handleCancel = () => {
        console.log('Operación cancelada');
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <Sidebar />

            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Agregar ventanilla</h2>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Número de ventanilla</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="numeroVentanilla"
                                    placeholder="Número de ventanilla"
                                    value={formData.numeroVentanilla}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Inicio de horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="inicioHorario"
                                    placeholder="Inicio de horario"
                                    value={formData.inicioHorario}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Fin de horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="finHorario"
                                    placeholder="Fin de horario"
                                    value={formData.finHorario}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            variant="success"
                            className="me-2"
                            type="submit"
                        >
                            Guardar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default AddWindow;