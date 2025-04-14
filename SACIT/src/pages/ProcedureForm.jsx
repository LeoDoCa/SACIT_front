import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Plus, X } from 'react-bootstrap-icons';
import Sidebar from '../components/Sidebar.jsx';
import useTextFieldValidation from './../hooks/useTextFieldValidation.jsx';
import useDescriptionValidation from '../hooks/useDescriptionValidation.jsx';
import useCostFieldValidation from '../hooks/useCostFieldValidation.jsx';
import DOMPurify from 'dompurify';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddProcedure = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    cost: '',
    estimatedTime: '30',
    creationDate: new Date().toISOString().split('T')[0], 
    status: 'Activo', 
    creatorId: 1, 
    requiredDocumentsNames: [''] 
  });

  const [errors, setErrors] = useState({});

  const validateName = useTextFieldValidation('Nombre');
  const validateDescription = useDescriptionValidation('Descripción');
  const validateCost = useCostFieldValidation('Costo');
  const validateDocument = useTextFieldValidation('Documento');

  const handleChange = (e, field, index = null) => {
    const value = e.target.value;
    const sanitizedValue = field === 'description' || field === 'name' || field === 'requiredDocumentsNames'
      ? DOMPurify.sanitize(value)
      : value;

    if (index !== null) {
      const newArray = [...formData[field]];
      newArray[index] = sanitizedValue;
      setFormData({ ...formData, [field]: newArray });
    } else {
      setFormData({ ...formData, [field]: sanitizedValue });
    }

    validateForm();
  };

  const handleAddDocument = () => {
    setFormData({
      ...formData,
      requiredDocumentsNames: [...formData.requiredDocumentsNames, '']
    });
  };

  const handleRemoveDocument = (index) => {
    const newDocuments = [...formData.requiredDocumentsNames];
    newDocuments.splice(index, 1);
    setFormData({ ...formData, requiredDocumentsNames: newDocuments });
  };

  const validateForm = () => {
    let newErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) {
      newErrors.description = descriptionError;
    }

    const costError = validateCost(formData.cost);
    if (costError) {
      newErrors.cost = costError;
    }

    if (!formData.estimatedTime) {
      newErrors.estimatedTime = 'El tiempo estimado es requerido';
    }

    if (formData.requiredDocumentsNames.some(doc => doc.trim() === '')) {
      newErrors.requiredDocumentsNames = 'Los nombres de documentos no pueden estar vacíos';
    }

    const documentErrors = formData.requiredDocumentsNames.map((doc, index) =>
      validateDocument(doc)
    );

    const documentWithErrors = documentErrors.find(error => error !== '');
    if (documentWithErrors) {
      newErrors.requiredDocumentsNames = documentWithErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const submissionData = {
          ...formData,
          cost: parseFloat(formData.cost),
          estimatedTime: parseInt(formData.estimatedTime, 10),
        };

        submissionData.requiredDocumentsNames = submissionData.requiredDocumentsNames.filter(
          (doc) => doc.trim() !== ''
        );

        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
          throw new Error('No se encontró un token de autenticación.');
        }

        const apiUrl = `${import.meta.env.VITE_SERVER_URL}/procedures/new`;

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await axios.post(apiUrl, submissionData, config);

        console.log('Trámite guardado:', response.data);

        Swal.fire({
          title: '¡Éxito!',
          text: 'Trámite guardado exitosamente',
          icon: 'success',
          confirmButtonText: 'OK',
        });

        setFormData({
          name: '',
          description: '',
          cost: '',
          estimatedTime: '30',
          creationDate: new Date().toISOString().split('T')[0],
          status: 'Activo',
          creatorId: 1,
          requiredDocumentsNames: [''],
        });
      } catch (error) {
        console.error('Error al guardar trámite:', error);

        Swal.fire({
          title: '¡Error!',
          text: `No se pudo guardar el trámite: ${error.response?.data?.message || error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
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
          name: '',
          description: '',
          cost: '',
          estimatedTime: '30',
          creationDate: new Date().toISOString().split('T')[0],
          status: 'Activo',
          creatorId: 1,
          requiredDocumentsNames: ['']
        });
        setErrors({});
      }
    });
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
                  placeholder="Ingrese el nombre del trámite"
                  value={formData.name}
                  onChange={(e) => handleChange(e, 'name')}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
                  placeholder="Ingrese una descripción del trámite"
                  value={formData.description}
                  onChange={(e) => handleChange(e, 'description')}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Costo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese el costo del trámite"
                  value={formData.cost}
                  onChange={(e) => handleChange(e, 'cost')}
                  isInvalid={!!errors.cost}
                />
                <Form.Control.Feedback type="invalid">{errors.cost}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Tiempo estimado</Form.Label>
                <Form.Select
                  value={formData.estimatedTime}
                  onChange={(e) => handleChange(e, 'estimatedTime')}
                  isInvalid={!!errors.estimatedTime}
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.estimatedTime}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => handleChange(e, 'status')}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En revisión">En revisión</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <div className="d-flex align-items-center justify-content-between">
                <Form.Label>Documentos requeridos</Form.Label>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="rounded-circle"
                  onClick={handleAddDocument}
                >
                  <Plus />
                </Button>
              </div>

              {formData.requiredDocumentsNames.map((doc, index) => (
                <Form.Group className="mb-2 d-flex align-items-center" key={`doc-${index}`}>
                  <Form.Control
                    type="text"
                    placeholder={`Documento ${index + 1}`}
                    value={doc}
                    onChange={(e) => handleChange(e, 'requiredDocumentsNames', index)}
                  />
                  {index > 0 && (
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleRemoveDocument(index)}
                    >
                      <X />
                    </Button>
                  )}
                </Form.Group>
              ))}
              {errors.requiredDocumentsNames && <div className="text-danger">{errors.requiredDocumentsNames}</div>}
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

export default AddProcedure;
