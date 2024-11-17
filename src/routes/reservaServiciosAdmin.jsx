import { useState, useEffect, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getReservaServicios, createReservaServicio, deleteReservaServicio, updateReservaServicio } from '../helpers/reservaServicio/reservaServicioService';
import { getReservas } from '../helpers/reserva/reservaService';
import { getServicios } from '../helpers/servicios/serviciosService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { AuthContext } from '../context/AuthContext';
import '../styles/salonesForm.css'
import '../styles/errors.css'

const schema = yup.object({
    reservaId: yup.string().required("Este campo es obligatorio"),
    servicioId: yup.string().required("Este campo es obligatorio"),
    precio: yup.number().transform((value) => (isNaN(value) ? undefined : value)).positive().required("Este campo es obligatorio"),
  }).required();

export default function ReservaServiciosAdmin() {
    const { auth } = useContext(AuthContext);
    const [reservaServicios, setReservaServicios] = useState([]);
    const [reservaServicioAEditar, setReservaServicioAEditar] = useState(null);
    const [reservaServicioAEliminar, setReservaServicioAEliminar] = useState(null);
    const [showReservaServicios, setshowReservaServicios] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [reservas, setReservas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema) 
    });

    useEffect(() => {
        async function ObtenerReservaServicios() {
            try {
                const response = await getReservaServicios();
                setReservaServicios(response.data.datos);
            } catch (error) {
                console.error("Error al obtener las reservasServicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerReservaServicios(); 
    }, [reservaServicios]);

    useEffect(() => {

        async function ObtenerReservas() {
            try {
                const response = await getReservas(); 
                setReservas(response.data.datos);
            } catch (error) {
                console.error("Error al obtener las reservas:", error);
                setError("Error al obtener los datos.");
            }
        }
    
        ObtenerReservas();
    }, []);

    useEffect(() => {
        async function ObtenerServicios() {
            try {
                const response = await getServicios();
                setServicios(response.data.datos);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerServicios(); 
    }, []);

    const onSubmit = async (data) => {
        const idDeReserva = Number(data.reservaId); 
        const idDeServicio = Number(data.servicioId);
        const reservaServicioData = { ...data, reservaId: idDeReserva, servicioId: idDeServicio};
        try {
            if (reservaServicioAEditar) {
                await updateReservaServicio(reservaServicioAEditar.id, reservaServicioData, auth);
                setReservaServicios(reservaServicios.map(reservaServicio => reservaServicio.id === reservaServicioAEditar.id 
                    ? { ...data, id: reservaServicioAEditar.id } 
                    : reservaServicio));
                setReservaServicioAEditar(null);  
            } else {
                const response = await createReservaServicio(reservaServicioData, auth);
                setReservaServicios([...reservaServicios, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            setError(reservaServicioAEditar ? "Error al actualizar la reservaServicio." : "Error al crear la reservaServicio.");
        }
    };

    const handleDeleteReservaServicio = (reservaServicioId) => {
        setReservaServicioAEliminar(reservaServicioId);
        setShowConfirmDialog(true);
    };

    const handleEditReservaServicio = (reservaServicio) => {
        setReservaServicioAEditar(reservaServicio);
        setFormVisible(true);

        Object.keys(reservaServicio).forEach((key) => {
            setValue(key, reservaServicio[key]);
        });
    };

    const confirmarDeleteReservaServicio = async () => {
        try {
            await deleteReservaServicio(reservaServicioAEliminar, auth);
            setReservaServicios(reservaServicios.filter(reservaServicio => reservaServicio.id !== reservaServicioAEliminar));
            setReservaServicioAEliminar(null); 
            setshowReservaServicios(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar la reservaServicio:", error);
            setError("Error al eliminar la reservaServicio.");
        }
    };

    const cancelarDeleteReservaServicio = () => {
        setReservaServicioAEliminar(null); 
        setshowReservaServicios(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>RESERVAS - SERVICIOS</h1>
                <hr/>
                <br/>
                {showReservaServicios && !formVisible && !reservaServicioAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear vinculo Reserva - Servicio
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{reservaServicioAEditar ? "Editar vinculo Reserva - Servicio" : "Alta vinculo Reserva - Servicio"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="reservaId" className="mb-3">
                                <Form.Label>Reserva</Form.Label>
                                <Form.Select
                                    {...register("reservaId")}
                                    isInvalid={!!errors.salonId}
                                >
                                <option value="">Selecciona una reserva</option>
                                    {reservas.map((reserva) => (
                                        <option key={reserva.id} value={reserva.id}>
                                        {reserva.titulo} 
                                        </option>
                                    ))}
                                </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="servicioId" className="mb-3">
                                <Form.Label>Servicio</Form.Label>
                                <Form.Select
                                    {...register("servicioId")}
                                    isInvalid={!!errors.servicioId}
                                >
                                <option value="">Selecciona un servicio</option>
                                    {servicios.map((servicio) => (
                                        <option key={servicio.id} value={servicio.id}>
                                        {servicio.nombre} 
                                        </option>
                                    ))}
                                </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                            <Form.Group controlId="precio" className="mb-3">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                type="number"
                                step="0.01"
                                placeholder="Precio"
                                {...register("precio")}
                                isInvalid={!!errors.precio}
                                />
                                {errors.precio && <p className="error-message">{errors.precio.message}</p>}
                            </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Guardar Vinculo
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setReservaServicioAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showReservaServicios && !formVisible && reservaServicios && (
                    <div>
                        {reservaServicios.map((reservaServicio) => (
                            <div key={reservaServicio.id}>
                                <hr />
                                <ul>
                                    <li>ReservaId: {reservaServicio.reservaId}</li>
                                    <li>ServicioId: {reservaServicio.servicioId}</li>
                                    <li>Precio: {reservaServicio.precio}</li>
                                </ul>
                                <Button variant="danger" onClick={() => handleDeleteReservaServicio(reservaServicio.id)}>Eliminar</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleEditReservaServicio(reservaServicio)}>Editar</Button>
                            </div>
                        ))}
                    </div>
                )}

                {reservaServicioAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteReservaServicio}
                        onCancel={cancelarDeleteReservaServicio}
                    />
                )}
            </Container>
        </>
    );
}