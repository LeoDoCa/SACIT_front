import React, { useState } from 'react';
import UserCard from '../components/UserCard';
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const [visibleRequirements, setVisibleRequirements] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRequirements = (index) => {
    setVisibleRequirements((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  //Datos estaticos en lo que esta el servicio
  const userCards = [
    {
      id: 1,
      title: "Servicio 1",
      subtitle: "Renueva tu pasaporte",
      price: "$500 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Licencia anterior"],
    },
    {
      id: 2,
      title: "Servicio 2",
      subtitle: "Actualiza tu visa",
      price: "$1000 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Visa actual"],
    },
    {
      id: 3,
      title: "Servicio 3",
      subtitle: "Renueva tu licencia",
      price: "$1500 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Licencia anterior"],
    },
    {
      id: 4,
      title: "Servicio 4",
      subtitle: "Actualiza tu visa",
      price: "$2000 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Visa actual"],
    },
    {
      id: 5,
      title: "Servicio 5",
      subtitle: "Renueva tu licencia",
      price: "$2500 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Licencia anterior"],
    },
    {
      id: 6,
      title: "Servicio 6",
      subtitle: "Actualiza tu visa",
      price: "$3000 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Visa actual"],
    },
    {
      id: 7,
      title: "Servicio 7",
      subtitle: "Renueva tu licencia",
      price: "$3500 MXN",
      requirements: ["Identificación oficial", "Comprobante de domicilio", "Licencia anterior"],
    }
  ];

  const searchQueryLower = searchQuery.toLowerCase();
  const filteredCards = searchQuery
    ? userCards.filter((card) => 
        card.title.toLowerCase().includes(searchQueryLower) ||
        card.subtitle.toLowerCase().includes(searchQueryLower)
      )
    : userCards;

  return (
    <>
      <Container className="py-4">
        
        <h1 className="text-center mb-4">Nuestros Servicios</h1>

        <div className="input-group mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-control border-secondary rounded-pill"
            placeholder="Buscar trámite (Ej: Pasaporte, Licencia...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar servicio"
            style={{
              paddingLeft: '2.5rem',
            }}
          />
        </div>

        <Row className="g-4">
          {filteredCards.map((card) => (
            <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
              <UserCard
                title={card.title}
                subtitle={card.subtitle}
                price={card.price}
                requirements={card.requirements}
                showRequirements={!!visibleRequirements[card.id]}
                toggleRequirements={() => toggleRequirements(card.id)}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Home;
