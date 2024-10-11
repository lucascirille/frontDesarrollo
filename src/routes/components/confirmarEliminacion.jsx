import React from 'react';

export default function ConfirmarEliminacion({ onConfirm, onCancel }) {
    return (
        <div>
            <h2>Confirmación de Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar el elemento?</p>
            <button onClick={onConfirm}>Sí, eliminar</button>
            <button onClick={onCancel}>Cancelar</button>
        </div>
    );
}