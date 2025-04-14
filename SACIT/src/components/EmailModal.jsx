import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EmailModal = ({
    showEmailModal,
    setShowEmailModal,
    email,
    setEmail,
    emailError,
    emailTouched,
    isSubmitting,
    handleEmailChange,
    handleEmailBlur,
    handleEmailSubmit,
    nombres,
    setNombres,
    apellidos,
    setApellidos,
}) => {
    return (
        <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Datos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleEmailSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombres</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus nombres"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingresa tus apellidos"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Ingresa tu correo electrónico"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={handleEmailBlur}
                            isInvalid={emailTouched && !!emailError}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button
                            variant="secondary"
                            onClick={() => setShowEmailModal(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="ms-2"
                            disabled={isSubmitting}
                        >
                            Confirmar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmailModal;