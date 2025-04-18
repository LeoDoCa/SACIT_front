import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import BackToHomeButton from '../components/BackToHomeButton';
import axios from 'axios';

const AgendarCita = () => {
    const location = useLocation();
    const tramiteUuid = location.state?.uuid;
    const tramiteName = location.state?.title;
    const API_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTramiteData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/procedures/${tramiteUuid}`);
                const tramite = response.data?.data;

                if (tramite) {
                    setRequiredDocuments(tramite.requieredDocuments || []);
                }
                setError(null);
            } catch (err) {
                console.error("Error al obtener los datos del trámite.");
                setError("No se pudieron cargar los datos del trámite. Intente de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        if (tramiteUuid) {
            fetchTramiteData();
        }
    }, [tramiteUuid, tramiteName, API_URL]);

    const calendarRef = useRef(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [identificacion, setIdentificacion] = useState(null);
    const [recetaMedica, setRecetaMedica] = useState(null);
    const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

    const [requiredDocuments, setRequiredDocuments] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');

    const [isUnloggedUserDataCaptured, setIsUnloggedUserDataCaptured] = useState(false);


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
            console.error("validateEmail: error de validación.");
            setEmailError(err.message);
            return false;
        }
    };


    const handleDateClick = async (info) => {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateObj = new Date(info.dateStr + "T00:00:00");

        if (selectedDateObj < today) {
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

        try {
            const response = await axios.post(`${API_URL}/availability/`, {
                date: info.dateStr,
                procedureUuid: tramiteUuid,
            });


            let times = response.data.data.availableTimes || [];

            const isToday = info.dateStr === new Date().toISOString().split('T')[0];

            if (isToday) {
                const currentHour = new Date();
                times = times.filter(time => {
                    const [hours, minutes] = time.split(':');
                    const timeToCompare = new Date();
                    timeToCompare.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

                    const marginTime = new Date(currentHour);
                    marginTime.setMinutes(currentHour.getMinutes() + 15);

                    return timeToCompare > marginTime;
                });
            }

            if (times.length === 0) {
                Swal.fire({
                    title: 'No hay horarios disponibles',
                    text: 'Intenta hacer una cita en otro día.',
                    icon: 'info',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }

            setAvailableTimes(times);
            setSelectedTime('');
        } catch (error) {
            console.error("Error al obtener los horarios disponibles");
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los horarios disponibles. Intente de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    };

    const handleNext = () => {
        const today = new Date();
        const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);

        if (selectedDateTime < today) {
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
        if (currentStep === 3) {
            setUploadedFiles({});

            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => {
                input.value = '';
            });
        }

        if (currentStep === 2) {
            setIdentificacion(null);
            setRecetaMedica(null);
        }

        setCurrentStep(currentStep - 1);
    };

    const handleModalCancel = () => {
        setEmail('');
        setEmailError('');
        setEmailTouched(false);
        setNombres('');
        setApellidos('');
        setShowEmailModal(false);
    };

    const handleCancelar = () => {
        setSelectedDate(null);
        setSelectedTime('');
        setAvailableTimes([]);
        setIdentificacion(null);
        setRecetaMedica(null);
        setUploadedFiles({});
        setEmail('');
        setEmailError('');
        setEmailTouched(false);
        setNombres('');
        setApellidos('');
        setIsUnloggedUserDataCaptured(false);
        setCurrentStep(1);
    };

    const handleConfirmar = async (isUnloggedUserCaptured = false) => {
        const accessToken = localStorage.getItem('accessToken');
        const isLoggedIn = !!accessToken;

        setIsProcessingConfirmation(true);

        if (!isLoggedIn && !isUnloggedUserCaptured && !isUnloggedUserDataCaptured) {
            setShowEmailModal(true);
            setIsProcessingConfirmation(false);
            return;
        }

        const formData = new FormData();

        const appointment = {
            date: selectedDate,
            startTime: `${selectedTime}:00`,
        };

        formData.append('appointment', JSON.stringify(appointment));

        if (!isLoggedIn) {
            const unloggedUser = {
                name: nombres,
                lastName: apellidos,
                email: email,
            };
            formData.append('unloggedUser', JSON.stringify(unloggedUser));
        } else {
            const userUuid = sessionStorage.getItem('userUuid');
            if (!userUuid) {
                console.error("Error: userUuid no está disponible en localStorage.");
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
                setIsProcessingConfirmation(false);
                return;
            }
            formData.append('userUuid', userUuid);
        }

        formData.append('procedureUuid', tramiteUuid);

        requiredDocuments.forEach((doc) => {
            formData.append('documentUuids', doc.uuid);
        });

        Object.keys(uploadedFiles).forEach((docUuid) => {
            formData.append('files', uploadedFiles[docUuid]);
        });

        try {
            const response = await axios.post(`${API_URL}/appointments/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
            Swal.fire({
                title: '¡Éxito!',
                text: `Cita agendada con éxito para el ${formatDate(selectedDate)} a las ${selectedTime}`,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                setIsProcessingConfirmation(false);
                handleCancelar();
            });

            handleCancelar();
        } catch (error) {
            console.error("Error al agendar la cita.");
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Hubo un problema al agendar la cita. Por favor, inténtalo de nuevo más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            setIsProcessingConfirmation(false);
        }
    };

    const handleEmailSubmit = async (values) => {
        setIsSubmitting(true);
        setIsProcessingConfirmation(true);

        try {
            await emailSchema.validate({ email: values.email });
            setEmailError('');
            setNombres(values.nombres);
            setApellidos(values.apellidos);
            setEmail(values.email);

            await handleConfirmar(true);
        } catch (err) {
            console.error("Error al confirmar la cita:", err);
            setEmailError(err.message);
        } finally {
            setShowEmailModal(false);
            setIsSubmitting(false);
            setIsProcessingConfirmation(false);
        }
    };

    const finishAppointmentBooking = () => {
        Swal.fire({
            title: '¡Éxito!',
            text: `Cita agendada con éxito para el ${formatDate(selectedDate)} a las ${selectedTime}`,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });

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

    const handleFileChange = (e, docUuid) => {
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

            setUploadedFiles((prevFiles) => ({
                ...prevFiles,
                [docUuid]: file,
            }));
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
                                dateClick={(info) => {
                                    handleDateClick(info);
                                }} height="auto"
                                themeSystem="bootstrap"
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
                                            {availableTimes.map((time, index) => {
                                                return (
                                                    <option key={index} value={time}>{time}</option>
                                                );
                                            })}
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
                            {requiredDocuments.length > 0 ? (
                                <Form>
                                    {requiredDocuments.map((doc) => (
                                        <Form.Group className="mb-4" key={doc.uuid}>
                                            <Form.Label><strong>{doc.name}:</strong></Form.Label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Sin archivos seleccionados"
                                                    value={uploadedFiles[doc.uuid]?.name || ""}
                                                    readOnly
                                                    style={{
                                                        backgroundColor: "#f8f9fa",
                                                        cursor: "default"
                                                    }}
                                                />
                                                <label className="input-group-text" style={{
                                                    cursor: "pointer",
                                                    width: "150px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    padding: "0.375rem 0",
                                                    backgroundColor: "#e0e0e0",
                                                    borderColor: "#d6d6d6"
                                                }}>
                                                    Examinar
                                                    <input
                                                        type="file"
                                                        className="d-none"
                                                        onChange={(e) => handleFileChange(e, doc.uuid)}
                                                        accept=".pdf"
                                                    />
                                                </label>
                                            </div>
                                            <Form.Text className="text-muted">
                                                Sube tu archivo oficial en formato PDF (máximo 0.5 MB).
                                            </Form.Text>
                                            {uploadedFiles[doc.uuid] && (
                                                <p className="mt-2 text-success">
                                                    Archivo subido: <strong>{uploadedFiles[doc.uuid].name}</strong>
                                                </p>
                                            )}
                                        </Form.Group>
                                    ))}
                                    <div className="d-flex justify-content-between mt-4">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={handleBack}
                                        >
                                            Atrás
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={() => setCurrentStep(currentStep + 1)}
                                            disabled={Object.keys(uploadedFiles).length !== requiredDocuments.length}
                                        >
                                            Siguiente
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <p className="text-muted">No se requieren documentos para este trámite.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    };

    if (loading) {
        return (
            <Container className="py-5 text-center">
                <p className="fs-5 text-muted">Cargando datos del trámite...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5 text-center">
                <p className="fs-5 text-danger">{error}</p>
            </Container>
        );
    }

    const Step3 = () => {
        return (
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Confirmación de Cita</h4>

                            <div className="mb-4">
                                <h5 className='mb-2'>Detalles de la Cita</h5>
                                <p className="mb-2">
                                    <strong>Trámite:</strong> {tramiteName}
                                </p>
                                <p className="mb-2">
                                    <strong>Fecha:</strong> {formatDate(selectedDate)}
                                </p>
                                <p>
                                    <strong>Hora:</strong> {selectedTime}
                                </p>
                            </div>

                            <div className="mb-4">
                                <h5 className='mb-2'>Documentos Subidos</h5>
                                {requiredDocuments.map((doc) => (
                                    <p key={doc.uuid} className="mb-2">
                                        <strong>{doc.name}:</strong>{' '}
                                        {uploadedFiles[doc.uuid] ? uploadedFiles[doc.uuid].name : 'No subido'}
                                    </p>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleBack}
                                    disabled={isProcessingConfirmation}
                                >
                                    Atrás
                                </Button>
                                <div>
                                    <Button
                                        variant="secondary"
                                        className="me-2"
                                        onClick={handleCancelar}
                                        disabled={isProcessingConfirmation}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="success"
                                        onClick={() => handleConfirmar(false)}
                                        disabled={isProcessingConfirmation}
                                    >
                                        {isProcessingConfirmation ? 'Procesando...' : 'Confirmar Cita'}
                                    </Button>
                                    {isProcessingConfirmation && (
                                        <div
                                            style={{
                                                position: 'fixed',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(0,0,0,0.3)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 9999
                                            }}
                                        >
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Procesando...</span>
                                            </div>
                                        </div>
                                    )}
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
                <BackToHomeButton />

                <h2 className="mb-4 mt-4">Agendar Cita</h2>

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
                    nombres={nombres}
                    setNombres={setNombres}
                    apellidos={apellidos}
                    setApellidos={setApellidos}
                    handleModalCancel={handleModalCancel}
                />

            </div>
        </Container>
    );
};

export default AgendarCita;
