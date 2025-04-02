import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Plus, X } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar.jsx'; 

const AddProcedure = () => {
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        costo: '',
        fechas: [''], 
        documentos: [''] 
    });

    const handleChange = (e, field, index = null) => {
        const value = e.target.value;

        if (index !== null) {
            const newArray = [...formData[field]];
            newArray[index] = value;
            setFormData({ ...formData, [field]: newArray });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const handleAddField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleRemoveField = (field, index) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1); 
        setFormData({ ...formData, [field]: newArray });
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        }
        if (!formData.costo.trim()) {
            newErrors.costo = 'El costo es obligatorio';
        } else if (isNaN(formData.costo) || parseFloat(formData.costo) < 0) {
            newErrors.costo = 'El costo debe ser un número válido y mayor o igual a 0';
        }
        if (formData.fechas.some(fecha => fecha.trim() === '')) {
            newErrors.fechas = 'No pueden haber fechas vacías';
        }
        if (formData.documentos.some(doc => doc.trim() === '')) {
            newErrors.documentos = 'No pueden haber documentos vacíos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Datos del trámite:', formData);
            alert('Trámite guardado exitosamente');
        }
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
                                    isInvalid={!!errors.nombre}
                                />
                                <Form.Control.Feedback type="invalid">{errors.nombre}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
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
                                    isInvalid={!!errors.descripcion}
                                />
                                <Form.Control.Feedback type="invalid">{errors.descripcion}</Form.Control.Feedback>
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
                                    isInvalid={!!errors.costo}
                                />
                                <Form.Control.Feedback type="invalid">{errors.costo}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="d-flex align-items-center justify-content-between">
                                <Form.Label>Fechas</Form.Label>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    className="rounded-circle"
                                    onClick={() => handleAddField('fechas')}
                                >
                                    <Plus />
                                </Button>
                            </div>

                            {formData.fechas.map((fecha, index) => (
                                <Form.Group className="mb-2 d-flex align-items-center" key={`fecha-${index}`}>
                                    <Form.Control
                                        type="text"
                                        placeholder={`Fecha ${index + 1}`}
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
                            {errors.fechas && <div className="text-danger">{errors.fechas}</div>}
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

                            {formData.documentos.map((doc, index) => (
                                <Form.Group className="mb-2 d-flex align-items-center" key={`doc-${index}`}>
                                    <Form.Control
                                        type="text"
                                        placeholder={`Documento ${index + 1}`}
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
                            {errors.documentos && <div className="text-danger">{errors.documentos}</div>}
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
