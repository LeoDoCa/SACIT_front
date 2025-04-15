import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BackToHomeButton = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); 
    };

    return (
        <Button
            variant="outline-primary"
            className="d-flex align-items-center gap-2 shadow-sm"
            onClick={handleGoHome}
            style={{
                borderRadius: '30px',
                padding: '10px 20px',
                fontWeight: 'bold',
                fontSize: '16px',
            }}
        >
            <i className="bi bi-house-door-fill"></i>
            Volver a Inicio
        </Button>
    );
};

export default BackToHomeButton;