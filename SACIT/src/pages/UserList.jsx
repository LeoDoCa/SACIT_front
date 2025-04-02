import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: 'Alan', apellido: 'Yagami', correo: '20223tn046@utez.edu.mx', rol: 'Usuario', contrasena: '' },
        { id: 2, nombre: 'Alan', apellido: 'Yagami', correo: '20223tn046@utez.edu.mx', rol: 'Administrador', contrasena: '' },
        // Agrega más usuarios según sea necesario
    ]);

    const [showModal, setShowModal] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);

    const handleEditar = (id) => {
        const usuario = usuarios.find((u) => u.id === id);
        setSelectedUsuario(usuario);
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        setUsuarios(usuarios.map((usuario) =>
            usuario.id === selectedUsuario.id ? selectedUsuario : usuario
        ));
        setShowModal(false);
    };

    const handleChange = (e, field) => {
        setSelectedUsuario({ ...selectedUsuario, [field]: e.target.value });
    };

    const handleEliminar = (id) => {
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));
    };

    return (
        <Container fluid className="p-0 d-flex" style={{ minHeight: '100vh' }}>
            {/* Sidebar */}
            <div style={{ width: '200px', backgroundColor: '#003366', color: 'white', position: 'sticky', top: 0, height: '100vh' }}>
                <Sidebar />
            </div>

            {/* Contenido principal */}
            <div className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <h2 className="mb-4">Usuarios</h2>

                <Table bordered hover className="bg-white">
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Nombre(s)</th>
                            <th style={{ width: '25%' }}>Apellido(s)</th>
                            <th style={{ width: '30%' }}>Correo</th>
                            <th style={{ width: '20%' }}>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.apellido}</td>
                                <td>{usuario.correo}</td>
                                <td className="text-center">
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(usuario.id)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleEliminar(usuario.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Modal para editar usuario */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUsuario && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUsuario.nombre}
                                    onChange={(e) => handleChange(e, 'nombre')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedUsuario.apellido}
                                    onChange={(e) => handleChange(e, 'apellido')}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Rol</Form.Label>
                                <Form.Select
                                    value={selectedUsuario.rol}
                                    onChange={(e) => handleChange(e, 'rol')}
                                >
                                    <option value="Usuario">Usuario</option>
                                    <option value="Administrador">Administrador</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={selectedUsuario.contrasena}
                                    onChange={(e) => handleChange(e, 'contrasena')}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListaUsuarios;