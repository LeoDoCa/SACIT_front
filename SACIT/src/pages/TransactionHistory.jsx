import React, { useEffect, useState } from 'react';
import { Container, Button, Spinner } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
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

        console.log("Token de acceso:", token);
        console.log("UUID de usuario:", userUuid);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`${API_URL}/appointments/user/${userUuid}`, config);
        console.log('Datos recibidos:', response.data);

        const histories = response.data?.data || [];

        const mappedHistories = histories.map((history) => {
          const formattedDate = `${String(history.date[2]).padStart(2, '0')}/${String(history.date[1]).padStart(2, '0')}/${history.date[0]}`;
          const formattedStartTime = `${String(history.startTime[0]).padStart(2, '0')}:${String(history.startTime[1]).padStart(2, '0')}`;
        
          return {
            procedureName: history.procedureName || 'Sin nombre',
            windowNumber: history.windowNumber || 'Sin ventanilla',
            date: formattedDate,
            startTime: formattedStartTime,
          };
        });

        setTransactions(mappedHistories);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
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
    <div style={{ minHeight: '100vh' }}>
      <UserSideBar />

      <h1 className="m-0 text-center" style={{ fontSize: '24px' }}>
        Historial de Trámites
      </h1>

      <Container className="mt-4 mb-4 d-flex justify-content-center">
        <Button
          variant="primary"
          className="px-4 py-2 rounded-pill d-flex align-items-center"
          style={{ backgroundColor: '#1e3a64', borderColor: '#1e3a64' }}
          onClick={handleGoHome}
        >
          <FaHome className="me-2" />
          Regresar a la Página Principal
        </Button>
      </Container>

      <Container className="mb-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando historial...</p>
          </div>
        ) : error ? (
          <p className="text-center text-danger">{error}</p>
        ) : transactions.length === 0 ? (
          <p className="text-center" style={{ fontSize: '18px', color: '#777' }}>
            No hay nada en el historial todavía.
          </p>
        ) : (
          transactions.map((transaction, index) => (
            <TransactionCard key={index} transaction={transaction} index={index} />
          ))
        )}
      </Container>
    </div>
  );
}

export default TransactionHistory;