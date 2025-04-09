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

const AddProcedure = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    costo: '',
    fechas: [''],
    documentos: ['']
  });

  const [errors, setErrors] = useState({});
  
  const validateNombre = useTextFieldValidation('Nombre');
  const validateDescripcion = useDescriptionValidation('Descripción');
  const validateCosto = useCostFieldValidation('Costo');
  const validateDocumentos = useTextFieldValidation('Documento');

  const handleChange = (e, field, index = null) => {
    const value = e.target.value;
  
    const sanitizedValue = DOMPurify.sanitize(value);
  
    if (field === 'descripcion' || field === 'nombre' || field === 'documentos') {
      if (field === 'descripcion') {
        setFormData({ ...formData, [field]: sanitizedValue });
      } else {
        if (index !== null) {
          const newArray = [...formData[field]];
          newArray[index] = sanitizedValue;
          setFormData({ ...formData, [field]: newArray });
        } else {
          setFormData({ ...formData, [field]: sanitizedValue });
        }
      }
    } else {
      if (index !== null) {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
      } else {
        setFormData({ ...formData, [field]: value });
      }
    }
  
    validateForm(field, value);
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

    const nameError = validateNombre(formData.nombre);
    if (nameError) {
      newErrors.nombre = nameError;
    }

    const descripcionError = validateDescripcion(formData.descripcion);
    if (descripcionError) {
      newErrors.descripcion = descripcionError;
    }

    const costError = validateCosto(formData.costo);
    if (costError) {
      newErrors.costo = costError;
    }

    if (formData.fechas.some(fecha => fecha.trim() === '')) {
      newErrors.fechas = 'No pueden haber fechas vacías';
    }

    const documentoErrors = formData.documentos.map((doc, index) => validateDocumentos(doc));
    const documentoConErrores = documentoErrors.find(error => error !== '');

    if (documentoConErrores) {
    newErrors.documentos = documentoConErrores;
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
                    nombre: '',
                    descripcion: '',
                    costo: '',
                    fechas: [''],
                    documentos: ['']
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
                  placeholder="Ingrese una descripción del trámite"
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
                  placeholder="Ingrese el costo del trámite"
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
                    type="date"
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
