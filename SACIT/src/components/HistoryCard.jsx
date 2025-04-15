import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function HistoryCard({ transaction, index }) {
  return (
    <Card key={index} className="mb-4 border border-primary">
      <Card.Body>
        <Row>
          <Col>
            <p className="mb-2">
              <strong>Trámite:</strong> {transaction.procedureName}
            </p>
            <p className="mb-2">
              <strong>N° Ventanilla que atendió:</strong> {transaction.windowNumber}
            </p>
            <p className="mb-2">
              <strong>Fecha de la cita:</strong> <span style={{ color: '#007bff' }}>{transaction.date}</span>
            </p>
            <p className="mb-2">
              <strong>Hora inicio de la cita:</strong> <span style={{ color: '#007bff' }}>{transaction.startTime}</span>
            </p>
            <p className="mb-0">
              <strong>Hora de fin de la cita:</strong> <span style={{ color: '#007bff' }}>{transaction.endTime}</span>
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default HistoryCard;