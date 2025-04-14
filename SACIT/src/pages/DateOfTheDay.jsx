import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import CitaCard from '../components/DateCard';
import axios from 'axios';

const CitasDelDia = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        const fetchCitas = async () => {
            const accessToken = localStorage.getItem('accessToken');

            try {
                const response = await axios.get(`${API_URL}/api/appointments/today`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setCitas(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar las citas:', err);

                if (err.response?.status === 404) {
                    setCitas([]);
                } else {
                    setError('No se pudieron cargar las citas. Intenta nuevamente más tarde.');
                }

                setLoading(false);
            }
        };

        fetchCitas();
    }, []);

    if (loading) {
        return <div>Cargando citas...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Citas del día</h2>

                <Row>
                    {citas.length === 0 ? (
                        <div className="text-center w-100">
                            <p className="text-muted">No hay citas disponibles para hoy.</p>
                        </div>
                    ) : (
                        citas.map((cita) => (
                            <Col key={cita.id} lg={4} md={6} className="mb-4">
                                <CitaCard tipo={cita.status} horario={cita.startTime} />
                            </Col>
                        ))
                    )}
                </Row>
            </div>
        </Container>
    );
};

export default CitasDelDia;