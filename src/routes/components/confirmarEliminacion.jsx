import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ConfirmarEliminacion({ onConfirm, onCancel, show }) {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: '#dc3545' }}>Confirmación de Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                    ¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel} style={{ marginRight: 'auto' }}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Sí, eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
