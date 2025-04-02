import React from 'react';
import { Card } from 'react-bootstrap';

const DateCard = ({ tipo, horario }) => {
    return (
        <Card className="shadow-sm">
            <Card.Body className="text-center">
                <div className="mb-2">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: '#007bff' }}
                    >
                        <rect x="3" y="4" width="18" height="16" rx="2" fill="#007bff" />
                        <path d="M7 4V2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M17 4V2" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M3 8H21" stroke="white" strokeWidth="2" />
                        <rect x="7" y="11" width="4" height="2" rx="0.5" fill="white" />
                        <rect x="7" y="14" width="4" height="2" rx="0.5" fill="white" />
                        <rect x="13" y="11" width="4" height="2" rx="0.5" fill="white" />
                        <rect x="13" y="14" width="4" height="2" rx="0.5" fill="white" />
                    </svg>
                </div>
                <Card.Title className="fs-6 fw-bold">{tipo}</Card.Title>
                <Card.Text className="text-muted small">
                    Horario: {horario}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default DateCard;