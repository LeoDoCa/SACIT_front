import React, { useState, useEffect } from "react";
import UserCard from "../components/UserCard";
import { Container, Row, Col } from "react-bootstrap";
import UserSideBar from "../components/UserSideBar";
import { Search } from "lucide-react";
import axios from "axios";

const Home = () => {
  const [visibleRequirements, setVisibleRequirements] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [userCards, setUserCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_SERVER_URL;

  const toggleRequirements = (index) => {
    setVisibleRequirements((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/procedures/`);
        const procedures = response.data?.data || [];

        const mappedProcedures = procedures.map((procedure) => ({
          uuid: procedure.uuid,
          title: procedure.name,
          subtitle: procedure.description,
          price: `$${procedure.cost} MXN`,
          requirements: procedure.requieredDocuments.map((doc) => doc.name),
        }));

        setUserCards(mappedProcedures);
        setError(null);
      } catch (err) {
        console.error("Error al cargar los trámites:", err);
        setError("No se pudieron cargar los trámites. Intente de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProcedures();
  }, [API_URL]);

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
      <section
        id="start"
        className="hero-section text-center py-5"
        style={{
          background: "linear-gradient(135deg, #1e2a3a 0%,rgb(37, 73, 137) 100%)",
          color: "white",
          padding: "60px 0",
          borderRadius: "0 0 20px 20px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <Container>
          <h1
            className="display-4 fw-bold"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Bienvenido a SACIT
          </h1>
          <p
            className="lead fs-4 mt-3"
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Gestiona tus trámites de forma rápida, sencilla y segura.
          </p>
          <button
            className="btn btn-light btn-lg mt-4 rounded-pill px-4 py-2"
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onClick={() => {
              const servicesSection = document.getElementById("services-section");
              servicesSection.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Comenzar ahora
          </button>
        </Container>
      </section>

      <UserSideBar />

      <Container id="services-section" className="py-5">
        <div className="services-header text-center mb-5">
          <h2
            className="fw-bold"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              color: "#1e3c72",
            }}
          >
            Nuestros Servicios
          </h2>
          <p
            className="text-muted"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            Explora nuestra amplia gama de servicios diseñados para facilitar
            tus trámites
          </p>
        </div>

        <div
          className="search-container mb-5"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div
            className="input-group"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "50px",
              overflow: "hidden",
            }}
          >
            <span
              className="input-group-text bg-white border-0"
              style={{ borderRadius: "50px 0 0 50px" }}
            >
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
                borderRadius: "0 50px 50px 0",
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <p className="fs-5 text-muted">Cargando trámites...</p>
          </div>
        ) : error ? (
          <div className="text-center py-5">
            <p className="fs-5 text-danger">{error}</p>
          </div>
        ) : (
          <Row className="g-4">
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <Col key={card.uuid} xs={12} sm={6} md={4} lg={3}>
                  <UserCard
                    title={card.title}
                    subtitle={card.subtitle}
                    price={card.price}
                    requirements={card.requirements}
                    showRequirements={!!visibleRequirements[card.uuid]}
                    toggleRequirements={() => toggleRequirements(card.uuid)}
                    uuid={card.uuid} 
                  />
                </Col>
              ))
            ) : (
              <div className="text-center w-100 py-5">
                <p className="fs-5 text-muted">
                  No se encontraron servicios que coincidan con tu búsqueda
                </p>
              </div>
            )}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Home;
