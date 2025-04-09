import React, { memo } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const EmailModal = memo(({ showEmailModal, setShowEmailModal, email, setEmail, emailError, emailTouched, isSubmitting, handleEmailChange, handleEmailBlur, handleEmailSubmit }) => {
    return (
        <Modal
            show={showEmailModal}
            onHide={() => {
                setShowEmailModal(false);
            }}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Form onSubmit={handleEmailSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar correo electrónico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Para confirmar tu cita, por favor ingresa tu correo electrónico:</p>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChange={(e) => {
                                handleEmailChange(e);
                            }}
                            onBlur={() => {
                                handleEmailBlur();
                            }}
                            isInvalid={emailTouched && !!emailError}
                            autoComplete="email"
                        />
                        {emailTouched && emailError && (
                            <Form.Control.Feedback type="invalid">
                                {emailError}
                            </Form.Control.Feedback>
                        )}
                        <Form.Text className="text-muted">
                            Recibirás la confirmación de la cita en este correo.
                        </Form.Text>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowEmailModal(false);
                        }}
                        disabled={isSubmitting}
                        type="button"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!email || isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Confirmar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
});

export default EmailModal;