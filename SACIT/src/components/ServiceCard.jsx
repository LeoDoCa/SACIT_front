import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

const ServiceCard = ({ name, time, onClick }) => {
  return (
    <Col xs={12} sm={6} md={3} className="mb-4">
      <Card className="text-center h-100 shadow-sm">
        <Card.Body className="d-flex flex-column">
          <div className="mb-2">
            <div className="bg-primary rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill text-white"></i>
            </div>
          </div>
          <Card.Title className="mb-1 fs-6">Renovación de Pasaporte</Card.Title>
          <Card.Text className="small mb-1">{name}</Card.Text>
          <Card.Text className="small text-muted">Horario: {time}</Card.Text>
          <div className="mt-auto pt-2">
            <Button variant="primary" size="sm" className="w-100" onClick={onClick}>Ver Cita</Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ServiceCard;
