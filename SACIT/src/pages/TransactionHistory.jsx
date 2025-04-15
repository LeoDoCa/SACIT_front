import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner, Row, Col, Card } from 'react-bootstrap';
import { FaHome, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransactionCard from '../components/HistoryCard';
import UserSideBar from '../components/UserSideBar.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';
import { getUserUuidFromSession } from './../config/http-client/jwt-utils.js';

function TransactionHistory() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER_URL;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const userUuid = getUserUuidFromSession();

  useEffect(() => {
    if (!isLoggedIn || !userUuid) {
      setError("No estás autenticado. Por favor, inicia sesión.");

      if (!userUuid) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }

      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setError("No hay token de acceso disponible. Por favor, inicia sesión nuevamente.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`${API_URL}/appointments/user/${userUuid}`, config);

        const histories = response.data?.data || [];

        const mappedHistories = histories.map((history) => {
          const formattedDate = `${String(history.date[2]).padStart(2, '0')}/${String(history.date[1]).padStart(2, '0')}/${history.date[0]}`;
          const formattedStartTime = `${String(history.startTime[0]).padStart(2, '0')}:${String(history.startTime[1]).padStart(2, '0')}`;
          const formattedEndTime = `${String(history.endTime[0]).padStart(2, '0')}:${String(history.endTime[1]).padStart(2, '0')}`;
        
          return {
            procedureName: history.procedureName || 'Sin nombre',
            windowNumber: history.windowNumber || 'Sin ventanilla',
            date: formattedDate,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
          };
        });

        setTransactions(mappedHistories);
        setError(null);
      } catch (err) {
        setError("No se pudo cargar el historial. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [API_URL, isLoggedIn, userUuid]);
  

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <UserSideBar />
      
      <div className="flex-grow-1">
        <Container className="py-4 mt-5">
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FaHistory size={24} className="me-2 text-primary" />
                  <h1 className="m-0" style={{ fontSize: '28px', fontWeight: '600', color: '#1e3a64' }}>
                    Historial de Citas
                  </h1>
                </div>
                <Button
                  variant="primary"
                  className="px-3 py-2 rounded-pill d-flex align-items-center"
                  style={{ backgroundColor: '#1e3a64', borderColor: '#1e3a64', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  onClick={handleGoHome}
                >
                  <FaHome className="me-2" />
                  Página Principal
                </Button>
              </div>
            </Col>
          </Row>

          {loading ? (
            <Card className="text-center py-5 shadow-sm border-0">
              <Card.Body>
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3 text-muted">Cargando historial de trámites...</p>
              </Card.Body>
            </Card>
          ) : error ? (
            <Card className="text-center py-4 shadow-sm border-0">
              <Card.Body>
                <div className="text-danger mb-3">
                  <i className="fas fa-exclamation-circle fa-3x"></i>
                </div>
                <h5 className="text-danger">Error</h5>
                <p>{error}</p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Intentar de nuevo
                </Button>
              </Card.Body>
            </Card>
          ) : transactions.length === 0 ? (
            <Card className="text-center py-5 shadow-sm border-0">
              <Card.Body>
                <div className="text-muted mb-3">
                  <i className="fas fa-folder-open fa-3x"></i>
                </div>
                <h5 className="text-muted">Sin registros</h5>
                <p style={{ fontSize: '16px', color: '#777' }}>
                  No hay trámites en tu historial todavía.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {transactions.map((transaction, index) => (
                <Col xs={12} md={6} lg={4} key={index} className="mb-4">
                  <TransactionCard transaction={transaction} index={index} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </div>
  );
}

export default TransactionHistory;
