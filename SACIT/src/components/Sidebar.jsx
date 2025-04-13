import { Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import React, { useContext } from 'react';
import AuthContext from '../config/context/auth-context';
import { logout } from '../config/http-client/authService';
import { CgFileDocument } from "react-icons/cg";
import { handleLogout } from '../utils/logoutHelper';

const Sidebar = () => {
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div style={{
            width: '200px',
            backgroundColor: '#1e2a3a',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="p-3">
                <div className="d-flex align-items-center mb-3">
                    <CgFileDocument size={30} color="white" className="me-2" />
                    <h2 className="mb-0 text-white">SACIT</h2>
                </div>
                <h4 className="mb-2 text-white">Menú</h4>

                <div className="accordion accordion-flush" id="menuAccordion">
                    <div className="accordion-item" style={{ backgroundColor: '#2d3a4e' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#tramitesMenu"
                                aria-expanded="false"
                                aria-controls="tramitesMenu"
                                style={{
                                    backgroundColor: '#1e2a3a',
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
                                <ul className="list-unstyled ms-3 mt-3">
                                    <li className="mb-2">
                                        <button
                                            onClick={() => navigate('/procedure-form')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Agregar
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => navigate('/procedure-list')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Ver Trámites
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item" style={{ backgroundColor: '#2d3a4e' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#ventanillasMenu"
                                aria-expanded="false"
                                aria-controls="ventanillasMenu"
                                style={{
                                    backgroundColor: '#1e2a3a',
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
                                <ul className="list-unstyled ms-3 mt-3">
                                    <li>
                                        <button
                                            onClick={() => navigate('/window-list')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Ver Ventanillas
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item" style={{ backgroundColor: '#2d3a4e' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#citasMenu"
                                aria-expanded="false"
                                aria-controls="citasMenu"
                                style={{
                                    backgroundColor: '#1e2a3a',
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
                                <ul className="list-unstyled ms-3 mt-3">
                                    <li>
                                        <button
                                            onClick={() => navigate('/date-of-the-day')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Ver Citas
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item mb-5" style={{ backgroundColor: '#2d3a4e' }}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed text-white"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#usuariosMenu"
                                aria-expanded="false"
                                aria-controls="usuariosMenu"
                                style={{
                                    backgroundColor: '#1e2a3a',
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
                                <ul className="list-unstyled ms-3 mt-3 pb-3">
                                    <li className="mb-2">
                                        <button
                                            onClick={() => navigate('/user-list')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Administradores
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => navigate('/window-user-list')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Usuarios Ventanillas
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => navigate('/regular-user-list')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Usuarios Regulares
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => navigate('/user-form')}
                                            className="text-white text-decoration-none btn btn-link p-0"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Crear Usuarios
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto" style={{ position: 'relative', width: '100%' }}>
                <Button
                    variant="success"
                    className="d-flex align-items-center justify-content-center w-100 rounded-0 py-2 p-2"
                    style={{ height: '4rem' }}
                    onClick={() => handleLogout(logout, dispatch, navigate)}
                >
                    <span className="me-2">CERRAR SESIÓN</span>
                    <svg width="24" height="30" viewBox="0 0 24 24" fill="none">
                        <path d="M5 5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h7v-2H5V5z" fill="white" />
                        <path d="M21 12l-4-4v3H9v2h8v3l4-4z" fill="white" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;