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
              <strong>Ventanilla:</strong> {transaction.windowNumber}
            </p>
            <p className="mb-2">
              <strong>Fecha de Cita:</strong> <span style={{ color: '#007bff' }}>{transaction.date}</span>
            </p>
            <p className="mb-0">
              <strong>Hora inicio de la Cita:</strong> <span style={{ color: '#007bff' }}>{transaction.startTime}</span>
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default HistoryCard;