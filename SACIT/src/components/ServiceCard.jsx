import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';

const ServiceCard = ({ name, time, procedureName, status, onClick }) => {
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

  return (
    <Col xs={12} sm={6} md={3} className="mb-4">
      <Card className="text-center h-100 shadow-sm">
        <Card.Body className="d-flex flex-column">
          <div className="mb-2">
            <div
              className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px', backgroundColor: '#1e3c72' }}
            >
              <i className="bi bi-person-fill text-white"></i>
            </div>
          </div>
          <Card.Title className="mb-1 fs-6">{procedureName}</Card.Title> 
          <Card.Text className="small mb-1">{name}</Card.Text>
          <Card.Text className="small text-muted">Horario: {formatTime(time)}</Card.Text>
          <Card.Text className="small text-muted">Estado: {status}</Card.Text>
          <div className="mt-auto pt-2">
            <Button style={{ backgroundColor: '#1e3c72' }} size="sm" className="w-100" onClick={onClick}>
              Ver Cita
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ServiceCard;