import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Plus, X } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar.jsx'; 

const AddProcedure = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        costo: '',
        fechas: [''], 
        documentos: [''] 
    });

    const handleChange = (e, field, index) => {
        const newArray = [...formData[field]];
        newArray[index] = e.target.value;
        setFormData({ ...formData, [field]: newArray });
    };

    const handleAddField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleRemoveField = (field, index) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1); 
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos del trámite:', formData);
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4" style={{ overflowY: 'auto', maxHeight: '100vh' }}>
                <h2 className="mb-4">Agregar trámite</h2>

                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                />
                            </Form.Group>
                            <br />
                        </Col>

                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="d-flex align-items-center justify-content-between">
                                    <Form.Label>Datos</Form.Label>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        className="rounded-circle"
                                        onClick={() => handleAddField('fechas')}
                                    >
                                        <Plus />
                                    </Button>
                                </div>

                                <div
                                    style={{
                                        maxHeight: '200px', 
                                        overflowY: 'auto',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        marginTop: '10px',
                                    }}
                                >
                                    {formData.fechas.map((fecha, index) => (
                                        <Form.Group className="mb-2 d-flex align-items-center" key={`fecha-${index}`}>
                                            <Form.Control
                                                type="text"
                                                placeholder={`Nombre de dato ${index + 1}`}
                                                value={fecha}
                                                onChange={(e) => handleChange(e, 'fechas', index)}
                                            />
                                            {index > 0 && (
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    className="ms-2"
                                                    onClick={() => handleRemoveField('fechas', index)}
                                                >
                                                    <X />
                                                </Button>
                                            )}
                                        </Form.Group>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Descripción"
                                    value={formData.descripcion}
                                    onChange={(e) => handleChange(e, 'descripcion')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Costo</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Costo"
                                    value={formData.costo}
                                    onChange={(e) => handleChange(e, 'costo')}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="d-flex align-items-center justify-content-between">
                                <Form.Label>Documentos</Form.Label>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="rounded-circle"
                                    onClick={() => handleAddField('documentos')}
                                >
                                    <Plus />
                                </Button>
                            </div>

                            <div
                                style={{
                                    maxHeight: '200px', 
                                    overflowY: 'auto',
                                    border: '1px solid #ced4da',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    marginTop: '10px',
                                }}
                            >
                                {formData.documentos.map((doc, index) => (
                                    <Form.Group className="mb-2 d-flex align-items-center" key={`doc-${index}`}>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Nombre documento ${index + 1}`}
                                            value={doc}
                                            onChange={(e) => handleChange(e, 'documentos', index)}
                                        />
                                        {index > 0 && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="ms-2"
                                                onClick={() => handleRemoveField('documentos', index)}
                                            >
                                                <X />
                                            </Button>
                                        )}
                                    </Form.Group>
                                ))}
                            </div>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" className="me-2">Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default AddProcedure;