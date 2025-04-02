import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';
import Sidebar from '../components/Siderbar';

const ListaTramites = () => {
    // Estado para los trámites
    const [tramites, setTramites] = useState([
        { id: 1, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 2, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 3, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 4, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 5, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 6, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 7, nombre: 'Tramite', costo: '$ 0.00'},
        { id: 8, nombre: 'Tramite', costo: '$ 0.00'},
    ]);

    // Función para eliminar un trámite
    const handleEliminar = (id) => {
        setTramites(tramites.filter(tramite => tramite.id !== id));
    };

    // Función para editar un trámite (solo marca la acción, implementación completa requeriría más código)
    const handleEditar = (id) => {
        console.log("Editar trámite con ID:", id);
        // Aquí iría la lógica para abrir formulario de edición o redireccionar
    };

    // Función para seleccionar un trámite
    const handleSeleccionar = (id) => {
        setTramites(tramites.map(tramite =>
            tramite.id === id
                ? { ...tramite, seleccionado: true }
                : { ...tramite, seleccionado: false }
        ));
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            {/* Importar el Sidebar */}
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Tramites</h2>

                <Table bordered hover className="bg-white">
                    <thead>
                        <tr>
                            <th style={{ width: '60%' }}>Tramite</th>
                            <th style={{ width: '20%' }}>Costo</th>
                            <th style={{ width: '20%' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tramites.map((tramite) => (
                            <tr
                                key={tramite.id}
                                className={tramite.seleccionado ? "bg-primary text-white" : ""}
                                onClick={() => handleSeleccionar(tramite.id)}
                            >
                                <td>{tramite.nombre}</td>
                                <td>{tramite.costo}</td>
                                <td className="text-center">
                                    <Button
                                        variant={tramite.seleccionado ? "outline-light" : "warning"}
                                        size="sm"
                                        className="me-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditar(tramite.id);
                                        }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant={tramite.seleccionado ? "outline-light" : "danger"}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEliminar(tramite.id);
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
};

export default ListaTramites;