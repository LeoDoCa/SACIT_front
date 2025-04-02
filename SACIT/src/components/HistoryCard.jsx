import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

function HistoryCard({ transaction, index }) {
  return (
    <Card key={index} className="mb-4 border border-primary">
      <Card.Body>
        <Row>
          <Col>
            <p className="mb-2">
              <strong>Trámite:</strong> {transaction.type}
            </p>
            <p className="mb-2">
              <strong>Documentos Subidos:</strong> {transaction.documents}
            </p>
            <p className="mb-2">
              <strong>Costo:</strong> {transaction.cost}
            </p>
            <p className="mb-2">
              <strong>Fecha de Cita:</strong> <span style={{ color: '#007bff' }}>{transaction.appointmentDate}</span>
            </p>
            <p className="mb-0">
              <strong>Fecha de Registro:</strong> <span style={{ color: '#007bff' }}>{transaction.registrationDate}</span>
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default HistoryCard;
