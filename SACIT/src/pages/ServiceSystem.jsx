import React, { useState, useEffect } from 'react';
import { Container, Row, Navbar } from 'react-bootstrap';
import ServiceCard from './../components/ServiceCard';
import ServiceDetailsModal from './../components/ServiceDetailsModal';
import UserSideBar from '../components/UserSideBar';
import { getUserUuidFromSession } from './../config/http-client/jwt-utils';
import AxiosClient from './../config/http-client/axios-client';
import Swal from 'sweetalert2';

const ServiceSystem = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const token = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userUuid = sessionStorage.getItem('userUuid');
        if (!userUuid) {
          console.error('No user UUID found in session');
          alert('No se encontró el UUID del usuario. Por favor, inicie sesión nuevamente.');
          return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found in localStorage');
          alert('No se encontró un token de acceso. Por favor, inicie sesión nuevamente.');
          return;
        }

        const windowResponse = await AxiosClient.get(`/user/${userUuid}/attended-window`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const windowUuid = typeof windowResponse.data === 'string' ? windowResponse.data : windowResponse.data.windowUuid;

        if (!windowUuid) {
          console.error('No window UUID returned from server');
          alert('No se pudo obtener la ventanilla asignada. Por favor, contacte al administrador.');
          return;
        }

        const appointmentsResponse = await AxiosClient.get(`/window/${windowUuid}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const appointments = appointmentsResponse.data.map((appointment) => ({
          id: appointment.id,
          uuid: appointment.uuid,
          procedureUuid: appointment.procedureUuid,
          name: `${appointment.userName} ${appointment.userLastName}`,
          email: appointment.userEmail,
          time: `${appointment.startTime[0]}:${appointment.startTime[1]} - ${appointment.endTime[0]}:${appointment.endTime[1]}`,
          procedureName: appointment.procedureName,
          status: appointment.status,
          files: [], 
        }));

        setServices(appointments);
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          alert(`Error: ${error.response.data.message || 'No se pudo obtener la información.'}`);
        } else if (error.request) {
          console.error('Error request:', error.request);
          alert('Error de red. Por favor, revise su conexión.');
        } else {
          console.error('Error message:', error.message);
          alert('Ocurrió un error inesperado. Por favor, intente nuevamente.');
        }
      }
    };

    fetchAppointments();
  }, []);

  const handleOpenModal = async (service) => {
    try {
      setSelectedService(service);
      setLoading(true);

      const token = localStorage.getItem('accessToken');
      const documents = await AxiosClient.get(`/appointments/${service.uuid}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (!Array.isArray(documents)) {
        console.error('Expected an array but got:', documents);
        Swal.fire({
          title: 'Error',
          text: 'La respuesta del servidor no contiene documentos válidos.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }

      const parsedDocuments = documents.map((doc, index) => {
        const byteCharacters = atob(doc.fileContent);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'application/pdf' });

        return {
          name: doc.fileName || `documento_${index + 1}.pdf`,
          blob, 
        };
      });



      setSelectedDocuments(parsedDocuments);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener los documentos:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al obtener los documentos del servicio.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleFinalizeService = async (uuid, status) => {
    try {
      if (typeof status !== 'string') {
        console.error('Invalid status:', status);
        Swal.fire({
          title: 'Error',
          text: 'El estado proporcionado no es válido.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
        return;
      }


      const response = await AxiosClient.patch(`/appointments/${uuid}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      Swal.fire({
        title: '¡Éxito!',
        text: 'El trámite se finalizó correctamente.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      setServices((prevServices) =>
        prevServices.map((service) =>
          service.uuid === uuid ? { ...service, status } : service
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error('Error finalizing service:', error.response?.data || error.message);
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Ocurrió un error al finalizar el trámite. Por favor, intente nuevamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="service-system-wrapper">
      <UserSideBar />
      <div className="main-content">
        <Navbar variant="dark" className="mb-4" expand="lg" style={{ backgroundColor: '#1a2942' }}>
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
                key={service.uuid}
                name={service.name}
                time={service.time}
                procedureName={service.procedureName}
                status={service.status}
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
          service={{ ...selectedService, documents: selectedDocuments }}
          handleFinalize={(status) => {
            handleFinalizeService(selectedService.uuid, status);
          }}
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