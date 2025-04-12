import React, { useState } from "react";
import UserCard from "../components/UserCard";
import { Container, Row, Col } from "react-bootstrap";
import UserSideBar from "../components/UserSideBar";
import { Search, Calendar, FileText, Shield, Clock } from "lucide-react";

const Home = () => {
  const [visibleRequirements, setVisibleRequirements] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRequirements = (index) => {
    setVisibleRequirements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const userCards = [
    {
      id: 1,
      title: "Servicio 1",
      subtitle: "Renueva tu pasaporte",
      price: "$500 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Licencia anterior",
      ],
    },
    {
      id: 2,
      title: "Servicio 2",
      subtitle: "Actualiza tu visa",
      price: "$1000 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Visa actual",
      ],
    },
    {
      id: 3,
      title: "Servicio 3",
      subtitle: "Renueva tu licencia",
      price: "$1500 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Licencia anterior",
      ],
    },
    {
      id: 4,
      title: "Servicio 4",
      subtitle: "Actualiza tu visa",
      price: "$2000 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Visa actual",
      ],
    },
    {
      id: 5,
      title: "Servicio 5",
      subtitle: "Renueva tu licencia",
      price: "$2500 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Licencia anterior",
      ],
    },
    {
      id: 6,
      title: "Servicio 6",
      subtitle: "Actualiza tu visa",
      price: "$3000 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Visa actual",
      ],
    },
    {
      id: 7,
      title: "Servicio 7",
      subtitle: "Renueva tu licencia",
      price: "$3500 MXN",
      requirements: [
        "Identificación oficial",
        "Comprobante de domicilio",
        "Licencia anterior",
      ],
    },
  ];

  const searchQueryLower = searchQuery.toLowerCase();
  const filteredCards = searchQuery
    ? userCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchQueryLower) ||
          card.subtitle.toLowerCase().includes(searchQueryLower)
      )
    : userCards;

  return (
    <>

      <section className="hero-section text-center py-5" style={{
        background: "linear-gradient(135deg, #1e2a3a 0%,rgb(37, 73, 137) 100%)",
        color: "white",
        padding: "60px 0",
        borderRadius: "0 0 20px 20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px"
      }}>
        <Container>
          <h1 className="display-4 fw-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Bienvenido a SACIT</h1>
          <p className="lead fs-4 mt-3" style={{ maxWidth: "700px", margin: "0 auto", fontFamily: "'Roboto', sans-serif" }}>
            Gestiona tus trámites de forma rápida, sencilla y segura.
          </p>
          <button className="btn btn-light btn-lg mt-4 rounded-pill px-4 py-2" style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            fontWeight: "600",
            transition: "all 0.3s ease"
          }}>
            Comenzar ahora
          </button>
        </Container>
      </section>

      <UserSideBar />

      <section className="features-section py-4 bg-white">
        <Container>
          <h2 className="text-center mb-5 fw-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: "#1e2a3a" }}>
            Nuestras Ventajas
          </h2>
          <Row className="text-center g-4">
            <Col md={3}>
              <div className="feature-card p-4" style={{
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "transform 0.3s ease",
                background: "white"
              }}>
                <div className="icon-wrapper mb-3" style={{
                  backgroundColor: "rgba(13, 110, 253, 0.1)",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <Calendar size={40} color="#0d6efd" />
                </div>
                <h5 className="mt-3 fw-bold">Agenda fácil</h5>
                <p className="text-muted">Agenda tus citas en minutos desde cualquier dispositivo.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-card p-4" style={{
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "transform 0.3s ease",
                background: "white"
              }}>
                <div className="icon-wrapper mb-3" style={{
                  backgroundColor: "rgba(25, 135, 84, 0.1)",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <FileText size={40} color="#198754" />
                </div>
                <h5 className="mt-3 fw-bold">Requisitos claros</h5>
                <p className="text-muted">Consulta qué necesitas antes de ir a tu cita.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-card p-4" style={{
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "transform 0.3s ease",
                background: "white"
              }}>
                <div className="icon-wrapper mb-3" style={{
                  backgroundColor: "rgba(220, 53, 69, 0.1)",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <Shield size={40} color="#dc3545" />
                </div>
                <h5 className="mt-3 fw-bold">Seguro y confiable</h5>
                <p className="text-muted">Tus datos están protegidos bajo protocolos modernos.</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="feature-card p-4" style={{
                borderRadius: "12px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                height: "100%",
                transition: "transform 0.3s ease",
                background: "white"
              }}>
                <div className="icon-wrapper mb-3" style={{
                  backgroundColor: "rgba(255, 193, 7, 0.1)",
                  borderRadius: "50%",
                  width: "80px",
                  height: "80px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto"
                }}>
                  <Clock size={40} color="#ffc107" />
                </div>
                <h5 className="mt-3 fw-bold">Disponible 24/7</h5>
                <p className="text-muted">Gestiona tus trámites cuando quieras, sin filas ni esperas.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <div className="services-header text-center mb-5">
          <h2 className="fw-bold" style={{ fontFamily: "'Montserrat', sans-serif", color: "#1e3c72" }}>Nuestros Servicios</h2>
          <p className="text-muted" style={{ maxWidth: "700px", margin: "0 auto" }}>Explora nuestra amplia gama de servicios diseñados para facilitar tus trámites</p>
        </div>

        <div className="search-container mb-5" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="input-group" style={{
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "50px",
            overflow: "hidden"
          }}>
            <span className="input-group-text bg-white border-0" style={{ borderRadius: "50px 0 0 50px" }}>
              <Search size={20} color="#6c757d" />
            </span>
            <input
              type="text"
              className="form-control border-0 py-3"
              placeholder="Buscar trámite (Ej: Pasaporte, Licencia...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar servicio"
              style={{
                fontSize: "16px",
                fontFamily: "'Roboto', sans-serif",
                borderRadius: "0 50px 50px 0"
              }}
            />
          </div>
        </div>

        <Row className="g-4">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Col key={card.id} xs={12} sm={6} md={4} lg={3}>
                <UserCard
                  title={card.title}
                  subtitle={card.subtitle}
                  price={card.price}
                  requirements={card.requirements}
                  showRequirements={!!visibleRequirements[card.id]}
                  toggleRequirements={() => toggleRequirements(card.id)}
                  icon={card.icon}
                  color={card.color}
                />
              </Col>
            ))
          ) : (
            <div className="text-center w-100 py-5">
              <p className="fs-5 text-muted">No se encontraron servicios que coincidan con tu búsqueda</p>
            </div>
          )}
        </Row>
      </Container>

      <footer style={{ 
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", 
        color: "white",
        borderRadius: "20px 20px 0 0",
        marginTop: "30px",
        padding: "40px 0 20px"
      }}>
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold mb-3">SACIT</h5>
              <p>Tu plataforma integral para la gestión de trámites gubernamentales.</p>
            </Col>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold mb-3">Enlaces rápidos</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Inicio</a></li>
                <li className="mb-2"><a href="#" className="text-white text-decoration-none">Servicios</a></li>
              </ul>
            </Col>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold mb-3">Contacto</h5>
              <p className="mb-1">Email: sacit3mail@gmail.com</p>
              <p className="mb-1">Teléfono: (55) 1234-5678</p>
            </Col>
          </Row>
          <hr className="my-4" style={{ opacity: "0.2" }} />
          <p className="text-center mb-0">© 2025 SACIT. Todos los derechos reservados.</p>
        </Container>
      </footer>

    </>
  );
};

export default Home;
