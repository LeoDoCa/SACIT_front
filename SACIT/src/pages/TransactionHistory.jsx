import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransactionCard from '../components/HistoryCard';
import UserSideBar from '../components/UserSideBar.jsx';

function TransactionHistory() {
    const navigate = useNavigate();
    
  const transactions = [
    {
      type: 'Renovar Pasaporte',
      documents: 'Acta de nacimiento, Identificacion oficial, Comprobante de domicilio',
      cost: '$1,500 MXN',
      appointmentDate: '2025-03-20 10:30 AM',
      registrationDate: '2025-03-15'
    },
    {
      type: 'Renovar Licencia de Conducir',
      documents: 'Acta de nacimiento, Identificacion oficial, Comprobante de domicilio',
      cost: '$1,500 MXN',
      appointmentDate: '2025-03-20 10:30 AM',
      registrationDate: '2025-03-15'
    },
    {
      type: 'Renovar CURP',
      documents: 'Acta de nacimiento, Identificacion oficial, Comprobante de domicilio',
      cost: '$1,500 MXN',
      appointmentDate: '2025-03-20 10:30 AM',
      registrationDate: '2025-03-15'
    }
  ];

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
        <UserSideBar />
        <h1 className="m-0 text-center" style={{ fontSize: '24px' }}>Historial de Trámites</h1>
      
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
        {transactions.length === 0 ? (
          <p className="text-center" style={{ fontSize: '18px', color: '#777' }}>No hay nada en el historial todavía.</p>
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
