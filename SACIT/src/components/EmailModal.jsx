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
    handleModalCancel
}) => {
    return (
        <Modal show={showEmailModal} onHide={() => {
            if (!isSubmitting) {
                setShowEmailModal(false);
            }
        }} backdrop={isSubmitting ? "static" : true} keyboard={!isSubmitting} centered>
            <Modal.Header closeButton={!isSubmitting}>
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
                            onClick={handleModalCancel}
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
                        {isSubmitting && (
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
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmailModal;