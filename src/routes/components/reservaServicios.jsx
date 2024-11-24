import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import { getServiciosBySalonId } from '../../helpers/salones/salonesService';
import { Card, Button, Row, Col } from 'react-bootstrap';
import '../../styles/salonInfo.css';
import { GetReservaIdByReservaNombre } from '../../helpers/reserva/reservaService'
import { createReservaServicio } from '../../helpers/reservaServicio/reservaServicioService'
import { AuthContext } from '../../context/AuthContext';

export default function ReservaServicios() {
    const { auth } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const { salonId, nombreReserva } = location.state || {};
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState('');
    const [selectedServicios, setSelectedServicios] = useState({});
    const [totalCargoAdicional, setTotalCargoAdicional] = useState(0);

    console.log("ID del Salón:", salonId);
    console.log("Nombre de la Reserva:", nombreReserva);

    useEffect(() => {
        async function ObtenerServicios(salonId) {
            try {
                const response = await getServiciosBySalonId(salonId);
                if (response.data && response.data.datos.length > 0) { 
                    setServicios(response.data.datos);
                } else {
                    console.log("No hay servicios disponibles para esta reserva.");
                }
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerServicios(salonId); 
    }, []);

    const handleCheckboxChange = (servicioId) => {
        setSelectedServicios(prevState => {
            const newState = {
                ...prevState,
                [servicioId]: !prevState[servicioId], 
            };

            const total = servicios.reduce((acc, servicio) => {
                if (newState[servicio.servicio.id]) {
                    return acc + servicio.precio; 
                }
                return acc;
            }, 0);

            setTotalCargoAdicional(total);


            return newState;
        });
    };

    const handleConfirm = async () => {
        console.log("Servicios confirmados:", selectedServicios);
        const isAnySelected = Object.values(selectedServicios).some(value => value === true);

        if (!isAnySelected) {
            setError("Debes seleccionar al menos un servicio.");
            return; 
        }

        try {
            //obtengo el id de la reserva
            const reservaResponse = await GetReservaIdByReservaNombre(nombreReserva);
            const reservaId = reservaResponse.data.datos; 
            console.log("ReservaId", reservaId);

            //obtengo servicios seleccionados
            const selectedIds = Object.keys(selectedServicios).filter(servicioId => selectedServicios[servicioId]);

            //vinculo servicios con la reserva
            for (const servicioId of selectedIds) {
                console.log("Servicio anterior", servicios);
                const servicio = servicios.find(x => x.servicio.id === parseInt(servicioId));
                console.log("Servicio", servicio);
                const nuevoReservaServicio = {
                    reservaId: reservaId,
                    servicioId: servicioId,
                    precio: servicio.precio
                };

                await createReservaServicio(nuevoReservaServicio, auth);

                navigate('/');
            }
        } catch (error){
            setError(error.message || "Error desconocido");
            console.log(error.message);
        }
        
    };

    const handleCancel = () => {
        navigate('/'); 
    };
    return(
        <>
            <h3 className="mb-4">Servicios</h3>
            {error === "Debes seleccionar al menos un servicio." && <div className="alert alert-danger">{error}</div>}
            {console.log("Servicios seleccionados:", selectedServicios)}
            {servicios.length > 0 ? (
                <Row className="justify-content-center">
                    {servicios.map((servicio) => (
                        <Col md={4} key={servicio.servicio.id} className="mb-3">
                            <Card className="reservaServicioCard border-success shadow-lg p-4 text-start">
                                <Card.Body>
                                    <Card.Title className="mt-2">{servicio.servicio.nombre}</Card.Title>
                                    <Card.Text className="small">{servicio.servicio.descripcion}</Card.Text>
                                    <Card.Text className="small">Precio: {servicio.precio}</Card.Text>
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${servicio.servicio.id}`} 
                                            checked={selectedServicios[servicio.servicio.id] || false} 
                                            onChange={() => handleCheckboxChange(servicio.servicio.id)} 
                                        />
                                        <label htmlFor={`checkbox-${servicio.servicio.id}`} className="ms-2">Seleccionar</label>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No hay servicios disponibles para este salon.</p>
            )}

            <hr/>
            <div className="mt-4">
                <h5>CARGO ADICIONAL: ${totalCargoAdicional}</h5>
            </div>

            <div className="button-container d-flex justify-content-center mt-4">
                <Button variant="success" onClick={handleConfirm} className="me-2">Confirmar Servicios</Button>
                <Button variant="danger" onClick={handleCancel}>Cancelar</Button>
            </div>
        </>
    )
}