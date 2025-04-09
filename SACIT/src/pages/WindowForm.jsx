import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar.jsx';
import Swal from 'sweetalert2';

import useTextFieldValidation from '../hooks/useTextFieldValidation.jsx';
import useCostFieldValidation from '../hooks/useCostFieldValidation.jsx';
import useTimeRangeValidation from '../hooks/useTimeRangeValidation';

import DOMPurify from 'dompurify';

const AddWindow = () => {
    const [formData, setFormData] = useState({
        numeroVentanilla: '',
        nombre: '',
        inicioHorario: '',
        finHorario: ''
    });

    const [errors, setErrors] = useState({});

    const validateNumeroVentanilla = useCostFieldValidation('Número de ventanilla');
    const validateNombre = useTextFieldValidation('Nombre');
    
    const { error: inicioHorarioError, validateTime: validateInicioHorario } = useTimeRangeValidation();
    const { error: finHorarioError, validateTime: validateFinHorario } = useTimeRangeValidation();

    const handleChange = (e, field) => {
        const value = DOMPurify.sanitize(e.target.value);
        setFormData(prev => ({ ...prev, [field]: value }));
    
        setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            if (newErrors[field]) {
                delete newErrors[field];
            }
            return newErrors;
        });
    
        validateForm(field, value);
    };
    
    

    const validateForm = () => {
        let newErrors = {};

        const numeroVentanillaError = validateNumeroVentanilla(formData.numeroVentanilla);
        if (numeroVentanillaError) {
            newErrors.numeroVentanilla = numeroVentanillaError;
        }

        const nameError = validateNombre(formData.nombre);
        if (nameError) {
            newErrors.nombre = nameError;
        }

        if (!formData.inicioHorario) {
            newErrors.inicioHorario = 'El inicio de horario es obligatorio.';
        } else if (!validateInicioHorario(formData.inicioHorario)) {
            newErrors.inicioHorario = inicioHorarioError;
        }

        if (!formData.finHorario) {
            newErrors.finHorario = 'El fin de horario es obligatorio.';
        } else if (!validateFinHorario(formData.finHorario)) {
            newErrors.finHorario = finHorarioError;
        } else if (formData.inicioHorario && formData.finHorario <= formData.inicioHorario) {
            newErrors.finHorario = 'El fin de horario debe ser después del inicio de horario.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Datos de la ventanilla:', formData);
        } else {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: 'Por favor, corrige los errores antes de enviar el formulario.',
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
                    numeroVentanilla: '',
                    nombre: '',
                    inicioHorario: '',
                    finHorario: ''
                });
                setErrors({});
            }
        });
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
                                    type="number"
                                    name="numeroVentanilla"
                                    placeholder="Número de ventanilla"
                                    value={formData.numeroVentanilla}
                                    onChange={(e) => handleChange(e, 'numeroVentanilla')}
                                    isInvalid={!!errors.numeroVentanilla}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.numeroVentanilla}
                                </Form.Control.Feedback>
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
                                    onChange={(e) => handleChange(e, 'nombre')}
                                    isInvalid={!!errors.nombre}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre}
                                </Form.Control.Feedback>
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
                                    onChange={(e) => handleChange(e, 'inicioHorario')}
                                    isInvalid={!!errors.inicioHorario}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.inicioHorario}
                                </Form.Control.Feedback>
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
                                    onChange={(e) => handleChange(e, 'finHorario')}
                                    isInvalid={!!errors.finHorario}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.finHorario}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            variant="secondary"
                            className="me-2"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default AddWindow;
