import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Siderbar';
import CitaCard from '../components/DateCard';

const CitasDelDia = () => {
    // Datos de ejemplo para las citas
    const citas = [
        { id: 1, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 2, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 3, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 4, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 5, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 6, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 7, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 8, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 9, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 10, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 11, tipo: 'Renovación de Pasaporte', horario: '00:00:00' },
        { id: 12, tipo: 'Renovación de Pasaporte', horario: '00:00:00' }
    ];

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            {/* Importar el Sidebar */}
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Citas del día</h2>

                <Row>
                    {citas.map((cita) => (
                        <Col key={cita.id} lg={4} md={6} className="mb-4">
                            <CitaCard tipo={cita.tipo} horario={cita.horario} />
                        </Col>
                    ))}
                </Row>
            </div>
        </Container>
    );
};

export default CitasDelDia;