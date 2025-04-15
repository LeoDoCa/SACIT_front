import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    nombres: yup
        .string()
        .trim()
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los nombres solo pueden contener letras y espacios.")
        .required("El campo nombres es obligatorio."),
    apellidos: yup
        .string()
        .trim()
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Los apellidos solo pueden contener letras y espacios.")
        .required("El campo apellidos es obligatorio."),
    email: yup
        .string()
        .trim()
        .email("Debe ser un correo electrónico válido.")
        .required("El campo correo electrónico es obligatorio."),
});

const EmailModal = ({
    showEmailModal,
    setShowEmailModal,
    isSubmitting,
    handleModalCancel,
    handleEmailSubmit,
}) => {
    const initialValues = {
        nombres: '',
        apellidos: '',
        email: '',
    };

    return (
        <Modal
            show={showEmailModal}
            onHide={() => {
                if (!isSubmitting) {
                    setShowEmailModal(false);
                }
            }}
            backdrop={isSubmitting ? "static" : true}
            keyboard={!isSubmitting}
            centered
        >
            <Modal.Header closeButton={!isSubmitting}>
                <Modal.Title>Confirmar Datos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(true);
                        handleEmailSubmit(values);
                        setSubmitting(false);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        isValid,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombres"
                                    placeholder="Ingresa tus nombres"
                                    value={values.nombres}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.nombres && !!errors.nombres}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.nombres}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellidos"
                                    placeholder="Ingresa tus apellidos"
                                    value={values.apellidos}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.apellidos && !!errors.apellidos}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.apellidos}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Ingresa tu correo electrónico"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={touched.email && !!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
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
                                    disabled={isSubmitting || !isValid}
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
                                            zIndex: 9999,
                                        }}
                                    >
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Procesando...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EmailModal;