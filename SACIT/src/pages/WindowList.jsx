import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import Swal from 'sweetalert2';

import useTextFieldValidation from '../hooks/useTextFieldValidation';
import useCostFieldValidation from '../hooks/useCostFieldValidation';
import useTimeRangeValidation from '../hooks/useTimeRangeValidation';

import DOMPurify from 'dompurify';

const ListWindow = () => {
    const [formData, setFormData] = useState({
        numero: '',
        nombre: '',
        inicioHorario: '',
        finHorario: ''
    });

    const [errors, setErrors] = useState({});

    const validateNumeroVentanilla = useCostFieldValidation('Número de ventanilla');
    const validateNombre = useTextFieldValidation('Nombre');

    const { error: inicioHorarioError, validateTime: validateInicioHorario } = useTimeRangeValidation();
    const { error: finHorarioError, validateTime: validateFinHorario } = useTimeRangeValidation();

    const [ventanillas, setVentanillas] = useState([
        { id: 1, numero: 1, nombre: 'Ventanilla Uno', inicioHorario: '09:00', finHorario: '15:00' },
        { id: 2, numero: 2, nombre: 'Ventanilla Dos', inicioHorario: '09:00', finHorario: '15:00' },
        { id: 3, numero: 3, nombre: 'Ventanilla Tres', inicioHorario: '09:00', finHorario: '15:00' },
        { id: 4, numero: 4, nombre: 'Ventanilla Cuatro', inicioHorario: '09:00', finHorario: '15:00' },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedVentanilla, setSelectedVentanilla] = useState(null);

    const handleEditar = (id) => {
        const ventanilla = ventanillas.find((v) => v.id === id);
        setSelectedVentanilla(ventanilla);
        setFormData({
            numero: ventanilla.numero,
            nombre: ventanilla.nombre,
            inicioHorario: ventanilla.inicioHorario,
            finHorario: ventanilla.finHorario
        });
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        if (validateForm()) {
            setVentanillas(ventanillas.map((ventanilla) =>
                ventanilla.id === selectedVentanilla.id ? { ...ventanilla, ...formData } : ventanilla
            ));
            setShowModal(false);
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

        const numeroVentanillaError = validateNumeroVentanilla(formData.numero);
        if (numeroVentanillaError) {
            newErrors.numero = numeroVentanillaError;
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
                    numero: '',
                    nombre: '',
                    inicioHorario: '',
                    finHorario: ''
                });
                setErrors({});
            }
        });
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
                                    value={formData.numero}
                                    onChange={(e) => handleChange(e, 'numero')}
                                    isInvalid={!!errors.numero}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.numero}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                    isInvalid={!!errors.nombre}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombre}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Inicio de Horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={formData.inicioHorario}
                                    onChange={(e) => handleChange(e, 'inicioHorario')}
                                    isInvalid={!!errors.inicioHorario}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.inicioHorario}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Fin de Horario</Form.Label>
                                <Form.Control
                                    type="time"
                                    value={formData.finHorario}
                                    onChange={(e) => handleChange(e, 'finHorario')}
                                    isInvalid={!!errors.finHorario}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.finHorario}
                                </Form.Control.Feedback>
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
