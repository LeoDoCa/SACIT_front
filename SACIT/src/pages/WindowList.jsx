import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button } from 'react-bootstrap';
import Sidebar from '../components/Siderbar';

const ListWindow = () => {
    // Estado para las ventanillas
    const [ventanillas, setVentanillas] = useState([
        { id: 1, numero: 1, nombre: 'Ventanilla1' },
        { id: 2, numero: 2, nombre: 'Ventanilla2' },
        { id: 3, numero: 3, nombre: 'Ventanilla3' },
        { id: 4, numero: 4, nombre: 'Ventanilla4' },
        { id: 5, numero: 5, nombre: 'Ventanilla5' },
        { id: 6, numero: 6, nombre: 'Ventanilla6' },
        { id: 7, numero: 7, nombre: 'Ventanilla7' },
        { id: 8, numero: 8, nombre: 'Ventanilla8' }
    ]);

    // Función para eliminar una ventanilla
    const handleEliminar = (id) => {
        setVentanillas(ventanillas.filter(ventanilla => ventanilla.id !== id));
    };

    // Función para editar una ventanilla
    const handleEditar = (id) => {
        console.log("Editar ventanilla con ID:", id);
        // Aquí iría la lógica para abrir formulario de edición o redireccionar
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            {/* Importar el Sidebar */}
            <Sidebar />

            {/* Contenido principal */}
            <div className="flex-grow-1 p-4">
                <h2 className="mb-4">Ventanillas</h2>

                <Table bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Nº Ventanilla</th>
                            <th style={{ width: '50%' }}>Nombre</th>
                            <th style={{ width: '25%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventanillas.map((ventanilla) => (
                            <tr key={ventanilla.id}>
                                <td>{ventanilla.numero}</td>
                                <td>{ventanilla.nombre}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(ventanilla.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleEliminar(ventanilla.id)}
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

export default ListWindow;