import React from 'react';
import { Button } from 'react-bootstrap';

const Sidebar = () => {
    return (
        <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', minHeight: '100vh' }}>
            <div className="p-3">
                <h4 className="mb-4 text-white">Menú</h4>

                <div className="accordion accordion-flush" id="menuAccordion">
                    <div className="accordion-item" style={{ backgroundColor: '#003366' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#tramitesMenu"
                                aria-expanded="false"
                                aria-controls="tramitesMenu"
                                style={{
                                    backgroundColor: '#003366',
                                    border: 'none',
                                }}
                            >
                                Trámites
                            </button>
                        </h2>
                        <div
                            id="tramitesMenu"
                            className="accordion-collapse collapse"
                            data-bs-parent="#menuAccordion"
                        >
                            <div className="accordion-body p-0">
                                <ul className="list-unstyled ms-3">
                                    <li>
                                        <a
                                            href="#agregar-tramite"
                                            className="text-white text-decoration-none"
                                        >
                                            Agregar
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#ver-tramites"
                                            className="text-white text-decoration-none"
                                        >
                                            Ver Trámites
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item" style={{ backgroundColor: '#003366' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#ventanillasMenu"
                                aria-expanded="false"
                                aria-controls="ventanillasMenu"
                                style={{
                                    backgroundColor: '#003366',
                                    border: 'none',
                                }}
                            >
                                Ventanillas
                            </button>
                        </h2>
                        <div
                            id="ventanillasMenu"
                            className="accordion-collapse collapse"
                            data-bs-parent="#menuAccordion"
                        >
                            <div className="accordion-body p-0">
                                <ul className="list-unstyled ms-3">
                                    <li>
                                        <a
                                            href="#agregar-ventanilla"
                                            className="text-white text-decoration-none"
                                        >
                                            Agregar
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#ver-ventanillas"
                                            className="text-white text-decoration-none"
                                        >
                                            Ver Ventanillas
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item" style={{ backgroundColor: '#003366' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#citasMenu"
                                aria-expanded="false"
                                aria-controls="citasMenu"
                                style={{
                                    backgroundColor: '#003366',
                                    border: 'none',
                                }}
                            >
                                Citas
                            </button>
                        </h2>
                        <div
                            id="citasMenu"
                            className="accordion-collapse collapse"
                            data-bs-parent="#menuAccordion"
                        >
                            <div className="accordion-body p-0">
                                <ul className="list-unstyled ms-3">
                                    <li>
                                        <a
                                            href="#ver-citas"
                                            className="text-white text-decoration-none"
                                        >
                                            Ver Citas
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item" style={{ backgroundColor: '#003366' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#usuariosMenu"
                                aria-expanded="false"
                                aria-controls="usuariosMenu"
                                style={{
                                    backgroundColor: '#003366',
                                    border: 'none',
                                }}
                            >
                                Usuarios
                            </button>
                        </h2>
                        <div
                            id="usuariosMenu"
                            className="accordion-collapse collapse"
                            data-bs-parent="#menuAccordion"
                        >
                            <div className="accordion-body p-0">
                                <ul className="list-unstyled ms-3">
                                    <li>
                                        <a
                                            href="#ver-usuarios"
                                            className="text-white text-decoration-none"
                                        >
                                            Ver Usuarios
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#crear-administradores"
                                            className="text-white text-decoration-none"
                                        >
                                            Crear Administradores
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto" style={{ position: 'absolute', bottom: 0, width: '200px' }}>
                <Button
                    variant="success"
                    className="d-flex align-items-center justify-content-center w-100 rounded-0 py-2"
                >
                    <span className="me-2">CERRAR SESIÓN</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h7v-2H5V5z" fill="white" />
                        <path d="M21 12l-4-4v3H9v2h8v3l4-4z" fill="white" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;