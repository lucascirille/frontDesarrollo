import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getCaracteristicasBySalonId, getServiciosBySalonId } from '../../helpers/salones/salonesService';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import '../../styles/salonInfo.css';

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
                    console.log("Caracteristicas iniciales", response.data.datos);
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
                    console.log("Servicios iniciales", response.data.datos);
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

    const caracteristicasActivas = caracteristicas.filter(caracteristica => caracteristica.estado === true);
    console.log("Caracteristicas activas", caracteristicasActivas);
    const serviciosActivos = servicios.filter(servicio => servicio.servicio.estado === true);
    console.log("Servicios Activos", serviciosActivos);

    return (
        <>
            <div className="salon-info-background p-4 mb-4">
                <Container className="mb-4">
                    <Row className="mb-4 justify-content-start">

                        <Col md={4} >
                            <h2 className="text-primary">{salon.nombre}</h2>
                            <p><i className="fas fa-users"></i>  <strong>Capacidad:</strong> {salon.capacidad} personas</p>
                            <p><i className="fas fa-ruler-combined"></i>  <strong>Dimensiones:</strong> {salon.dimensionesMt2} m²</p>
                            <p><i className="fas fa-door-open"></i> <strong>Tipo:</strong> {salon.tipo}</p>
                        </Col>
                        <Col md={4} className="text-start mt-3">
                            <p> <i className="fas fa-phone-alt"></i>  <strong>Teléfono:</strong> {salon.telefono}</p>
                            <p><i className="fas fa-map-marker-alt"></i>  <strong>Dirección:</strong> {salon.direccion}</p>
                            <p><i className="fas fa-city"></i>  <strong>Localidad:</strong> {salon.localidad}</p>
                        </Col>
                    </Row>
                </Container>
            </div>

            <h3 className="mb-4">Características</h3>
            {caracteristicasActivas.length > 0 ? (
                <Row className="justify-content-center">
                    {caracteristicasActivas.map((caracteristica, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="caracteristicaCard text-center shadow-sm">
                                <Card.Body>
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

            <div className="styled-hr">
                <i className="fas fa-star"></i>
            </div>

            <h3 className="mb-4">Servicios</h3>
            {serviciosActivos.length > 0 ? (
                <Row className="justify-content-center">
                    {serviciosActivos.map((servicio, index) => (
                        <Col md={4} key={index} className="mb-3">
                            <Card className="servicioCard border-success shadow-lg p-4 text-start">
                                <Card.Body>
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
