import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getCaracteristicasBySalonId, getServiciosBySalonId } from '../../helpers/salones/salonesService';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import '../../styles/salonInfo.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function SalonInfo() {
    const { id } = useParams();
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState('');
    const location = useLocation();
    const { salon } = location.state;

    useEffect(() => {
        async function ObtenerCaracteristicas(id) {
            try {
                const response = await getCaracteristicasBySalonId(id);
                if (response.data && response.data.datos.length > 0) { 
                    setCaracteristicas(response.data.datos);
                } else {
                    console.log("No hay características disponibles para este salón.");
                }
            } catch (error) {
                console.error("Error al obtener las caracteristicas:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerCaracteristicas(id); 
    }, [id]);
    
    useEffect(() => {
        async function ObtenerServicios(id) {
            try {
                const response = await getServiciosBySalonId(id);
                if (response.data && response.data.datos.length > 0) { 
                    setServicios(response.data.datos);
                } else {
                    console.log("No hay servicios disponibles para este salón.");
                }
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerServicios(id); 
    }, [id]);

    return (
        <>
            <div className="salon-info-background p-4 mb-4">
                <Container className="mb-4">
                    <Row className="mb-4 justify-content-start">

                        <Col md={4} >
                            <h2 className="text-primary">{salon.nombre}</h2>
                            <p><i className="fas fa-users"></i> <strong>Capacidad:</strong> {salon.capacidad} personas</p>
                            <p><i className="fas fa-ruler-combined"></i> <strong>Dimensiones:</strong> {salon.dimensionesMt2} m²</p>
                        </Col>
                        <Col md={4} className="text-start mt-3">
                            <p className="text-muted">Teléfono: {salon.telefono}</p>
                            <p className="text-muted">Dirección: {salon.direccion}</p>
                            <p className="text-muted">Localidad: {salon.localidad}</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <h3 className="mb-4">Características</h3>
            {caracteristicas.length > 0 ? (
                <Row>
                    {caracteristicas.map((caracteristica, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="text-center shadow-sm">
                                <Card.Body>
                                    <img
                                        src={"/images/donut.png"} 
                                        style={{ width: '50px', height: '50px' }} 
                                        alt={caracteristica.nombre}
                                    />
                                    <Card.Title className="mt-2">{caracteristica.nombre}</Card.Title>
                                    <Card.Text>{caracteristica.descripcion}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No hay características disponibles.</p>
            )}

            <hr style={{ margin: '20px 0', border: '1px solid #ccc', borderTop: '3px solid red' }} />

            <h3 className="mb-4">Servicios</h3>
            {servicios.length > 0 ? (
                <Row>
                    {servicios.map((servicio, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="border-success shadow-lg p-4 text-start">
                                <Card.Body>
                                    <i className="fas fa-gamepad fa-2x"></i> 
                                    <Card.Title className="mt-2">{servicio.servicio.nombre}</Card.Title>
                                    <Card.Text className="small">{servicio.servicio.descripcion}</Card.Text>
                                    <Card.Text className="small">Precio: {servicio.precio}</Card.Text> 
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <p>No hay servicios disponibles.</p>
            )}

            <Link to={"/salonesCliente"}>
                <Button variant="primary" className="mt-4">Volver</Button>
            </Link>
        </>
    );
}
