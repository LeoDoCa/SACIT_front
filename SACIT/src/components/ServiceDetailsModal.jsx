import React, { useState } from 'react';
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap';

const ServiceDetailsModal = ({ show, handleClose, service, handleFinalize }) => {
  if (!service) return null;

  const [serviceStatus, setServiceStatus] = useState('atendido');

  const handleFinish = () => {
    handleFinalize(service.name, serviceStatus); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
      <Modal.Body className="p-4">
        <Container>
          <h3 className="border-bottom pb-2 mb-4">Datos del trámite</h3>
          <h4 className="text-center mb-4">Renovación de Pasaporte</h4>

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
              <Col>Renovación de Pasaporte</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="text-end"><strong>Horario:</strong></Col>
              <Col>{service.time}</Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5>Archivos del usuario:</h5>
            <div className="bg-light p-3 rounded">
              <Row>
                {service.files.map((file, index) => (
                  <Col key={index} xs={6} md={3} className="text-center mb-3">
                    <div className="bg-white p-2 rounded">
                      <div className="text-center mb-2">
                        <span className={`bg-${file.type === 'PDF' ? 'danger' : 'primary'} text-white px-2 py-1 rounded`}>
                          {file.type}
                        </span>
                      </div>
                      <div className="small">
                        <a href={file.link} target="_blank" rel="noopener noreferrer">{file.name}</a>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          <div className="mb-4">
            <h5>Estado del trámite:</h5>
            <Form>
              <div className="d-flex align-items-center">
                <Form.Check
                  type="radio"
                  id="atendido"
                  label="Atendido"
                  name="serviceStatus"
                  checked={serviceStatus === 'atendido'}
                  onChange={() => setServiceStatus('atendido')}
                  className="me-4"
                />
                <Form.Check
                  type="radio"
                  id="nopresento"
                  label="No se presentó"
                  name="serviceStatus"
                  checked={serviceStatus === 'nopresento'}
                  onChange={() => setServiceStatus('nopresento')}
                />
              </div>
            </Form>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="danger" onClick={handleClose}>Cancelar</Button>
            <Button variant="success" onClick={handleFinish}>Finalizar Trámite</Button>
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default ServiceDetailsModal;
