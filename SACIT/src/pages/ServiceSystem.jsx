import React, { useState } from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import ServiceCard from './../components/ServiceCard'; 
import ServiceDetailsModal from './../components/ServiceDetailsModal'; 
import UserSideBar from '../components/UserSideBar';

const ServiceSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { 
      id: 1, 
      name: 'Pedrito Sola', 
      email: 'Pedrito_S23@gmail.com', 
      time: '10:00 AM',
      files: [
        { name: 'Ine.pdf', link: '#', type: 'PDF' },
        { name: 'Comprobante.pdf', link: '#', type: 'PDF' },
      ]
    },
    { 
      id: 2, 
      name: 'Frankie Rivers', 
      email: 'Frankie_Riv83@gmail.com', 
      time: '11:00 AM',
      files: [
        { name: 'Ine.pdf', link: '#', type: 'PDF' }
      ]
    }
  ];

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleFinalizeService = (name, status) => {
    console.log(`El trámite finalizó con éxito. El usuario "${name}" fue "${status}"`);
  };

  return (
    <div className="service-system-wrapper">
      <UserSideBar />  
      <div className="main-content">
        <Navbar variant="dark" className="mb-4" expand="lg" style={{backgroundColor: "#1a2942"}}>
          <Container>
            <Navbar.Brand>
              <h4>Sistema de Administración de Citas y Trámites</h4>
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="main-container">
        <h2 className="text-center my-5">Trámites del día</h2>
        
        <Row className="justify-content-center">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              time={service.time}
              onClick={() => handleOpenModal(service)}
            />
          ))}
        </Row>
      </Container>
      </div>

      {selectedService && (
        <ServiceDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          service={selectedService}
          handleFinalize={handleFinalizeService}
        />
      )}

      <style>{`
        .service-system-wrapper {
          display: flex;
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .main-content {
          flex: 1;
          padding-left: 0;
          transition: padding-left 0.3s;
        }

        .sidebar.open + .main-content {
          padding-left: 250px;
        }
        
        .page-content {
          padding: 2rem 0 5rem;
        }
        
        @media (max-width: 768px) {
          .main-content {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceSystem;