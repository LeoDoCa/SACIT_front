import React, { useState } from 'react';
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap';

const ServiceDetailsModal = ({ show, handleClose, service, handleFinalize }) => {
  if (!service) return null;

  const [serviceStatus, setServiceStatus] = useState('Finalizada'); 

  const handleFinish = () => {
    handleFinalize(serviceStatus); 
    handleClose();
  };

  const handleDownload = (blob, name) => {
    const url = window.URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    if (newWindow) {
      newWindow.focus(); 
    } else {
      alert('Permite las ventanas emergentes para abrir el documento.');
    }
  };

  const formatTime = (time) => {
    if (!time || typeof time !== 'string' || !time.includes(' - ')) {
      return 'Horario no disponible';
    }

    const [start, end] = time.split(' - ');

    const format = (t) => {
      if (!t || !t.includes(':')) return '00:00';
      const [hours, minutes] = t.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    return `${format(start)} - ${format(end)}`;
  };

  const chunkDocuments = (documents, size) => {
    const chunks = [];
    for (let i = 0; i < documents.length; i += size) {
      chunks.push(documents.slice(i, i + size));
    }
    return chunks;
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Body className="p-4">
        <Container>
          <h3 className="border-bottom pb-2 mb-4 text-center">Cita para el trámite</h3>
          <h4 className="text-center mb-4">{service.procedureName}</h4>

          <div className="mb-4">
            <h5>Datos del usuario:</h5>
            <Row className="mb-2">
              <Col xs={4} className="text-end"><strong>Nombre:</strong></Col>
              <Col>{service.name}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="text-end"><strong>Correo:</strong></Col>
              <Col>{service.email}</Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5>Datos del trámite:</h5>
            <Row className="mb-2">
              <Col xs={4} className="text-end"><strong>Nombre del trámite:</strong></Col>
              <Col>{service.procedureName}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="text-end"><strong>Horario:</strong></Col>
              <Col>{formatTime(service.time)}</Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5>Documentos:</h5>
            {service.documents && service.documents.length > 0 ? (
              chunkDocuments(service.documents, 3).map((row, rowIndex) => (
                <Row key={rowIndex} className="mb-2">
                  {row.map((doc, index) => (
                    <Col key={index} xs={4} className="text-center">
                      <Button
                        variant="link"
                        style={{ textDecoration: 'none', color: '#0d6efd' }}
                        onClick={() => handleDownload(doc.blob, doc.name)}
                      >
                        📄 {doc.name}
                      </Button>
                    </Col>
                  ))}
                </Row>
              ))
            ) : (
              <p>No hay documentos disponibles.</p>
            )}
          </div>

          <div className="mb-4">
            <h5>Estado del trámite:</h5>
            <Form>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id="Finalizada"
                  label="Atendida"
                  name="serviceStatus"
                  checked={serviceStatus === 'Finalizada'}
                  onChange={() => setServiceStatus('Finalizada')}
                  className="me-4"
                />
                <Form.Check
                  type="radio"
                  id="NoSePresento"
                  label="No se presentó"
                  name="serviceStatus"
                  checked={serviceStatus === 'No se presentó'}
                  onChange={() => setServiceStatus('No se presentó')}
                />
              </div>
            </Form>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="danger" onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={handleFinish}
              style={{ backgroundColor: '#1e3c72', borderColor: '#1e3c72' }}
            >
              Guardar
            </Button>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ServiceDetailsModal;