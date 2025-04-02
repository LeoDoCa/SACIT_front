import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Form, ProgressBar } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

const AgendarCita = () => {
    const calendarRef = useRef(null);

    // Estados para la cita
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [recetaMedica, setRecetaMedica] = useState(null);

    // Control de la pantalla actual
    const [currentStep, setCurrentStep] = useState(1);

    // Función para manejar el clic en una fecha
    const handleDateClick = (info) => {
        setSelectedDate(info.dateStr);

        // Generar horarios disponibles (esto normalmente vendría de tu API)
        const times = [];
        for (let hour = 9; hour <= 17; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`);
            if (hour < 17) {
                times.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        }
        setAvailableTimes(times);
        setSelectedTime(''); // Resetear la hora seleccionada
    };

    // Función para ir al siguiente paso
    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    // Función para ir al paso anterior
    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    // Función para cancelar todo el proceso
    const handleCancelar = () => {
        setSelectedDate(null);
        setSelectedTime('');
        setAvailableTimes([]);
        setIdentificacion(null);
        setRecetaMedica(null);
        setCurrentStep(1);
    };

    // Función para confirmar la cita final
    const handleConfirmar = () => {
        console.log('Cita confirmada para:', selectedDate, selectedTime);
        console.log('Archivos adjuntos:', identificacion, recetaMedica);
        // Aquí se enviaría la información a tu backend
        alert(`Cita agendada con éxito para el ${formatDate(selectedDate)} a las ${selectedTime}`);
        // Resetear todo después de confirmar (opcional)
        handleCancelar();
    };

    // Función para formatear la fecha para mostrar
    const formatDate = (dateStr) => {
        // Crear la fecha manteniendo la fecha original sin ajuste de zona horaria
        const [year, month, day] = dateStr.split('-').map(Number);

        // El mes en JavaScript es base 0 (0-11), por lo que restamos 1 al mes
        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Manejar cambios en los archivos
    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Componente para la barra de progreso
    const StepProgressBar = () => {
        return (
            <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                    <div className={`text-center ${currentStep >= 1 ? 'text-primary fw-bold' : ''}`}>Seleccionar Fecha</div>
                    <div className={`text-center ${currentStep >= 2 ? 'text-primary fw-bold' : ''}`}>Subir Documentos</div>
                    <div className={`text-center ${currentStep >= 3 ? 'text-primary fw-bold' : ''}`}>Confirmar Cita</div>
                </div>
                <ProgressBar>
                    <ProgressBar variant="primary" now={currentStep === 1 ? 33.3 : (currentStep === 2 ? 66.6 : 100)} key={1} />
                </ProgressBar>
            </div>
        );
    };

    // Componente para el paso 1: Selección de fecha y hora
    const Step1 = () => {
        return (
            <Row>
                <Col md={8}>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek'
                                }}
                                locale={esLocale}
                                selectable={true}
                                dateClick={handleDateClick}
                                height="auto"
                                themeSystem="bootstrap"
                                eventColor="#003366"
                                buttonText={{
                                    today: 'Hoy',
                                    month: 'Mes',
                                    week: 'Semana'
                                }}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Selecciona Fecha y Hora</h4>
                            {selectedDate ? (
                                <>
                                    <p className="mb-3">
                                        <strong>Fecha seleccionada:</strong><br />
                                        {formatDate(selectedDate)}
                                    </p>

                                    <Form.Group className="mb-4">
                                        <Form.Label><strong>Selecciona horario disponible:</strong></Form.Label>
                                        <Form.Select
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                        >
                                            <option value="">Seleccionar horario</option>
                                            {availableTimes.map((time, index) => (
                                                <option key={index} value={time}>{time}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            ) : (
                                <p className="text-muted">Selecciona una fecha en el calendario para ver los horarios disponibles.</p>
                            )}

                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    variant="secondary"
                                    className="me-2"
                                    onClick={handleCancelar}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleNext}
                                    disabled={!selectedDate || !selectedTime}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    // Componente para el paso 2: Subida de documentos
    const Step2 = () => {
        return (
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Subir Documentos</h4>
                            <Form>
                                {/* Input para subir identificación */}
                                <Form.Group className="mb-4">
                                    <Form.Label><strong>Identificación:</strong></Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setIdentificacion)}
                                    />
                                    <Form.Text className="text-muted">
                                        Sube una copia de tu identificación oficial.
                                    </Form.Text>
                                </Form.Group>

                                {/* Input para subir receta médica */}
                                <Form.Group className="mb-4">
                                    <Form.Label><strong>Receta Médica:</strong></Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setRecetaMedica)}
                                    />
                                    <Form.Text className="text-muted">
                                        Sube tu receta médica si aplica.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-flex justify-content-between mt-4">
                                    <Button
                                        variant="outline-secondary"
                                        onClick={handleBack}
                                    >
                                        Atrás
                                    </Button>
                                    <div>
                                        <Button
                                            variant="secondary"
                                            className="me-2"
                                            onClick={handleCancelar}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handleNext}
                                            disabled={!identificacion} // Al menos la identificación es requerida
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    // Componente para el paso 3: Confirmación de la cita
    const Step3 = () => {
        return (
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Confirmación de Cita</h4>

                            <div className="mb-4">
                                <h5>Detalles de la Cita</h5>
                                <p className="mb-2">
                                    <strong>Fecha:</strong> {formatDate(selectedDate)}
                                </p>
                                <p>
                                    <strong>Hora:</strong> {selectedTime}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5>Documentos Subidos</h5>
                                <p className="mb-2">
                                    <strong>Identificación:</strong> {identificacion ? identificacion.name : 'No subido'}
                                </p>
                                <p>
                                    <strong>Receta Médica:</strong> {recetaMedica ? recetaMedica.name : 'No subido'}
                                </p>
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleBack}
                                >
                                    Atrás
                                </Button>
                                <div>
                                    <Button
                                        variant="secondary"
                                        className="me-2"
                                        onClick={handleCancelar}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={handleConfirmar}
                                    >
                                        Confirmar Cita
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    // Renderizado principal
    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>


            {/* Contenido principal */}
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Agendar Cita</h2>

                {/* Barra de progreso */}
                <StepProgressBar />

                {/* Contenido según el paso actual */}
                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
            </div>
        </Container>
    );
};

export default AgendarCita;