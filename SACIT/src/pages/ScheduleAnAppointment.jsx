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

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [recetaMedica, setRecetaMedica] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);

    const [scheduledAppointments, setScheduledAppointments] = useState([
        { date: '2025-04-07', time: '09:00', duration: 30 },
        { date: '2025-04-07', time: '10:00', duration: 45 },
        { date: '2025-04-07', time: '11:00', duration: 60 },
        { date: '2025-04-08', time: '09:30', duration: 30 },
        { date: '2025-04-08', time: '11:00', duration: 60 },
        { date: '2025-04-09', time: '10:15', duration: 45 },
        { date: '2025-04-09', time: '13:00', duration: 30 },
        { date: '2025-04-10', time: '09:00', duration: 30 },
        { date: '2025-04-10', time: '12:00', duration: 45 },
        { date: '2025-04-11', time: '10:30', duration: 30 },
        { date: '2025-04-11', time: '14:00', duration: 60 },
        { date: '2025-04-14', time: '09:45', duration: 30 },
        { date: '2025-04-14', time: '11:00', duration: 60 },
        { date: '2025-04-15', time: '10:00', duration: 30 },
        { date: '2025-04-15', time: '13:00', duration: 45 },
        { date: '2025-04-16', time: '09:30', duration: 30 },
        { date: '2025-04-16', time: '11:00', duration: 60 },
        { date: '2025-04-17', time: '10:15', duration: 45 },
        { date: '2025-04-17', time: '12:00', duration: 30 },
        { date: '2025-04-18', time: '09:00', duration: 30 },
        { date: '2025-04-18', time: '14:00', duration: 45 },
    ]);

    const handleDateClick = (info) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateObj = new Date(info.dateStr + "T00:00:00");

        const todayTime = today.getTime();
        const selectedTime = selectedDateObj.getTime();

        if (selectedTime < todayTime) {
            alert('No puedes seleccionar días anteriores al actual.');
            return;
        }

        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);

        if (selectedDateObj > maxDate) {
            alert('Por favor selecciona una fecha válida (entre hoy y los próximos 30 días).');
            return;
        }

        setSelectedDate(info.dateStr);

        const isToday = selectedDateObj.toDateString() === today.toDateString();

        const times = [];
        const startHour = 9;
        const endHour = 15;

        let currentHour = startHour;
        let currentMinute = 0;

        if (isToday) {
            const now = new Date();

            if (now.getHours() > startHour ||
                (now.getHours() === startHour && now.getMinutes() > 0)) {

                currentHour = now.getHours();

                if (now.getMinutes() <= 30) {
                    currentMinute = 30;
                } else {
                    currentHour += 1;
                    currentMinute = 0;
                }
            }
        }

        const appointmentsForDay = scheduledAppointments.filter(
            appointment => appointment.date === info.dateStr
        );

        while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
            const timeSlot = new Date(selectedDateObj);
            timeSlot.setHours(currentHour, currentMinute, 0, 0);

            const slotEnd = new Date(timeSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + 30);

            const isSlotAvailable = !appointmentsForDay.some(appointment => {
                const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
                const appointmentEnd = new Date(appointmentStart);
                appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment.duration);

                return (
                    (timeSlot < appointmentEnd && slotEnd > appointmentStart)
                );
            });

            if (isSlotAvailable) {
                const formattedHour = currentHour.toString().padStart(2, '0');
                const formattedMinute = currentMinute.toString().padStart(2, '0');
                times.push(`${formattedHour}:${formattedMinute}`);
            }

            if (currentMinute === 30) {
                currentMinute = 0;
                currentHour++;
            } else {
                currentMinute = 30;
            }
        }

        setAvailableTimes(times);
        setSelectedTime('');
    };

    const handleNext = () => {
        const today = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);

        if (selectedDateTime < today) {
            alert('Por favor selecciona una hora válida.');
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleCancelar = () => {
        setSelectedDate(null);
        setSelectedTime('');
        setAvailableTimes([]);
        setIdentificacion(null);
        setRecetaMedica(null);
        setCurrentStep(1);
    };

    const handleConfirmar = () => {
        console.log('Cita confirmada para:', selectedDate, selectedTime);
        console.log('Archivos adjuntos:', identificacion, recetaMedica);

        alert(`Cita agendada con éxito para el ${formatDate(selectedDate)} a las ${selectedTime}`);

        handleCancelar();
    };

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);

        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleFileChange = (e, setFile) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

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
                                    right: 'dayGridMonth,timeGridWeek',
                                }}
                                locale={esLocale}
                                selectable={true}
                                dateClick={(info) => handleDateClick(info)}
                                events={scheduledAppointments.map((appointment) => ({
                                    title: 'Cita',
                                    start: `${appointment.date}T${appointment.time}`,
                                    end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + appointment.duration * 60000).toISOString(),
                                }))}
                                height="auto"
                                themeSystem="bootstrap"
                                eventColor="#003366"
                                buttonText={{
                                    today: 'Hoy',
                                    month: 'Mes',
                                    week: 'Semana',
                                }}
                                validRange={{
                                    start: new Date(), 
                                }}
                                hiddenDays={[0, 6]} 
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

    const Step2 = () => {
        return (
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Subir Documentos</h4>
                            <Form>
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
                                            disabled={!identificacion}
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

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Agendar Cita</h2>

                <StepProgressBar />

                {currentStep === 1 && <Step1 />}
                {currentStep === 2 && <Step2 />}
                {currentStep === 3 && <Step3 />}
            </div>
        </Container>
    );
};

export default AgendarCita;