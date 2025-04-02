import React from 'react';
import { Card, Button, Nav } from 'react-bootstrap';
import { FaFileAlt, FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';

function UserCard({ title, subtitle, price, requirements, showRequirements, toggleRequirements }) {
  return (
    <Card className="shadow-lg border-0 rounded-lg h-100">
      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex justify-content-center mb-3">
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#007bff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaFileAlt color="white" size={30} />
            </div>
          </div>

          <Card.Title className="fw-bold">{title}</Card.Title>
          <small className="text-muted d-block">{subtitle}</small>
          <Card.Text className="text-success fw-bold mt-2">{price}</Card.Text>
        </div>

        <div>
          <Button
            variant="link"
            className="text-primary p-0 d-flex align-items-center justify-content-center w-100 mb-2"
            onClick={toggleRequirements}
            aria-expanded={showRequirements}
          >
            Ver requisitos {showRequirements ? <FaChevronUp className="ms-1" /> : <FaChevronDown className="ms-1" />}
          </Button>

          {showRequirements && (
            <div className="bg-light p-2 mb-3 text-start rounded">
              {requirements.map((req, i) => (
                <div key={req + i} className="d-flex align-items-start mb-1">
                  <FaCheck className="text-danger mt-1 me-2" size={14} />
                  <small>{req}</small>
                </div>
              ))}
            </div>
          )}

          <Nav.Link href="/schedule" className="btn btn-primary w-100 rounded-pill text-center">
            <Button variant="primary" className="w-100 rounded-pill">
              Agendar
            </Button>
          </Nav.Link>

        </div>
      </Card.Body>
    </Card>
  );
}

UserCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  requirements: PropTypes.arrayOf(PropTypes.string).isRequired,
  showRequirements: PropTypes.bool.isRequired,
  toggleRequirements: PropTypes.func.isRequired,
};

export default UserCard;
