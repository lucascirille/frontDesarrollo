import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const TrabajadoresModal = ({ show, handleClose, trabajadores, profesion }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{profesion}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {trabajadores && trabajadores.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Email</th>
                                <th>Valoración (Estrellas)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trabajadores.map((trabajador, index) => (
                                <tr key={index}>
                                    <td>{trabajador.nombre}</td>
                                    <td>{trabajador.apellido}</td>
                                    <td>{trabajador.email}</td>
                                    <td>{trabajador.estrellas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay trabajadores disponibles para esta profesión.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TrabajadoresModal;
