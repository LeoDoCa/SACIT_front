import React, { useState, useRef, memo } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Modal } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import * as Yup from 'yup';
import EmailModal from '../components/EmailModal';
import Swal from 'sweetalert2';

const AgendarCita = () => {
    const calendarRef = useRef(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [recetaMedica, setRecetaMedica] = useState(null);

    const [currentStep, setCurrentStep] = useState(1);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

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

    const isUserLoggedIn = () => {
        return false;
    };

    const emailSchema = Yup.object().shape({
        email: Yup.string()
            .required('El correo electrónico es obligatorio')
            .email('Por favor, introduce un correo electrónico válido')
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'El formato del correo electrónico no es válido'
            )
            .test(
                'no-consecutive-dots',
                'El correo no puede contener puntos consecutivos',
                value => !(value && value.includes('..'))
            )
            .test(
                'no-consecutive-at',
                'El correo no puede contener @ consecutivos',
                value => !(value && value.includes('@@'))
            )
            .test(
                'domain-check',
                'El dominio del correo debe tener al menos un punto',
                value => {
                    if (!value) return true;
                    const parts = value.split('@');
                    return parts.length > 1 && parts[1].includes('.');
                }
            )
            .test(
                'tld-length',
                'La extensión del dominio debe tener entre 2 y 6 caracteres',
                value => {
                    if (!value) return true;
                    const parts = value.split('@');
                    if (parts.length <= 1) return true;
                    const domainParts = parts[1].split('.');
                    const tld = domainParts[domainParts.length - 1];
                    return tld.length >= 2 && tld.length <= 6;
                }
            )
            .test(
                'no-space',
                'El correo no puede contener espacios',
                value => !(value && value.includes(' '))
            )
            .test(
                'max-length',
                'El correo no puede exceder los 320 caracteres',
                value => !(value && value.length > 320)
            )
            .test(
                'valid-local-part',
                'La parte local del correo no es válida',
                value => {
                    if (!value) return true;
                    const parts = value.split('@');
                    return parts.length > 0 && parts[0].length > 0 && parts[0].length <= 64;
                }
            )
            .test(
                'valid-domain-part',
                'El dominio del correo no es válido',
                value => {
                    if (!value) return true;
                    const parts = value.split('@');
                    return parts.length > 1 && parts[1].length > 0 && parts[1].length <= 255;
                }
            )
            .test(
                'no-special-chars-at-ends',
                'El correo no puede comenzar o terminar con caracteres especiales en la parte local',
                value => {
                    if (!value) return true;
                    const parts = value.split('@');
                    if (parts.length <= 0) return true;
                    const localPart = parts[0];
                    return !/^[._-]|[._-]$/.test(localPart);
                }
            )
    });

    const validateEmail = async () => {
        try {
            await emailSchema.validate({ email });
            setEmailError('');
            return true;
        } catch (err) {
            console.error("validateEmail: error de validación:", err.message);
            setEmailError(err.message);
            return false;
        }
    };


    const handleDateClick = (info) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateObj = new Date(info.dateStr + "T00:00:00");

        const todayTime = today.getTime();
        const selectedTime = selectedDateObj.getTime();

        if (selectedTime < todayTime) {
            Swal.fire({
                title: 'Fecha no válida',
                text: 'No puedes seleccionar días anteriores al actual.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 30);

        if (selectedDateObj > maxDate) {
            Swal.fire({
                title: 'Fecha fuera de rango',
                text: 'Por favor selecciona una fecha válida (entre hoy y los próximos 30 días).',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
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
            // Reemplazar alert por SweetAlert2
            Swal.fire({
                title: 'Hora no válida',
                text: 'Por favor selecciona una hora válida.',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
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
        if (!isUserLoggedIn()) {
            setEmail('');
            setEmailError('');
            setEmailTouched(false);
            setShowEmailModal(true);
            return;
        }

        finishAppointmentBooking();
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const isValid = await validateEmail();

        if (isValid) {
            setTimeout(() => {
                setIsSubmitting(false);
                setShowEmailModal(false);
                finishAppointmentBooking();
            }, 1000);
        } else {
            setIsSubmitting(false);
        }
    };

    const finishAppointmentBooking = () => {
        if (email) {
            Swal.fire({
                title: '¡Éxito!',
                text: `Cita agendada con éxito para el ${formatDate(selectedDate)} a las ${selectedTime}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        }

        handleCancelar();
        setEmail('');
        setEmailError('');
        setEmailTouched(false);
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
            const file = e.target.files[0];

            if (file.type !== 'application/pdf') {
                Swal.fire({
                    title: 'Formato incorrecto',
                    text: 'Solo se permiten archivos en formato PDF.',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
                e.target.value = '';
                return;
            }

            const maxSizeInBytes = 0.5 * 1024 * 1024;
            if (file.size > maxSizeInBytes) {
                Swal.fire({
                    title: 'Archivo demasiado grande',
                    text: 'El archivo debe pesar 0.5 MB o menos.',
                    icon: 'warning',
                    confirmButtonText: 'Entendido'
                });
                e.target.value = '';
                return;
            }

            setFile(file);
        }
    };


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailBlur = () => {
        setEmailTouched(true);
        validateEmail();
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
                                        Sube una copia de tu identificación oficial en formato PDF (máximo 0.5 MB).
                                    </Form.Text>
                                    {identificacion && (
                                        <p className="mt-2 text-success">
                                            Archivo subido: <strong>{identificacion.name}</strong>
                                        </p>
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label><strong>Receta Médica:</strong></Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => handleFileChange(e, setRecetaMedica)}
                                    />
                                    <Form.Text className="text-muted">
                                        Sube tu receta médica en formato PDF (máximo 0.5 MB).
                                    </Form.Text>
                                    {recetaMedica && (
                                        <p className="mt-2 text-success">
                                            Archivo subido: <strong>{recetaMedica.name}</strong>
                                        </p>
                                    )}
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

                <EmailModal
                    showEmailModal={showEmailModal}
                    setShowEmailModal={setShowEmailModal}
                    email={email}
                    setEmail={setEmail}
                    emailError={emailError}
                    emailTouched={emailTouched}
                    isSubmitting={isSubmitting}
                    handleEmailChange={handleEmailChange}
                    handleEmailBlur={handleEmailBlur}
                    handleEmailSubmit={handleEmailSubmit}
                />
            </div>
        </Container>
    );
};

export default AgendarCita;
