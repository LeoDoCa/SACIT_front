import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar } from 'react-bootstrap';
import ServiceCard from './../components/ServiceCard'; 
import ServiceDetailsModal from './../components/ServiceDetailsModal'; 

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
    <div className="min-vh-100 bg-light">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">
            <Button className="navbar-toggler border-0" type="button" aria-label="Menú de navegación">
              <span className="navbar-toggler-icon"></span>
            </Button>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <h2 className="text-center mb-4">Trámites del día</h2>

        <Row>
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

      {selectedService && (
        <ServiceDetailsModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          service={selectedService}
          handleFinalize={handleFinalizeService}
        />
      )}
    </div>
  );
};

export default ServiceSystem;
