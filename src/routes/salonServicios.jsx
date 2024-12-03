import { useState, useEffect, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getSalonServicios, createSalonServicio, deleteSalonServicio, updateSalonServicio } from '../helpers/salonServicios/salonesServiciosService';
import { getSalones } from '../helpers/salones/salonesService';
import { getServicios } from '../helpers/servicios/serviciosService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { AuthContext } from '../context/AuthContext';
import '../styles/salonesForm.css'
import '../styles/errors.css'

const schema = yup.object({
    salonId: yup.string().required("Este campo es obligatorio"),
    servicioId: yup.string().required("Este campo es obligatorio"),
    precio: yup.number().transform((value) => (isNaN(value) ? undefined : value)).positive("debe ser un valor positivo").max(999999, "El precio no puede exceder 4 dígitos").required("Este campo es obligatorio"),
  }).required();

export default function SalonServicios() {
    const { auth } = useContext(AuthContext);
    const [salonesServicios, setsalonesServicios] = useState([]);
    const [salonServicioAEditar, setsalonServicioAEditar] = useState(null);
    const [salonServicioAEliminar, setsalonServicioAEliminar] = useState(null);
    const [showsalonesServicios, setshowsalonesServicios] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [salones, setSalones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema) 
      });

    useEffect(() => {
        async function ObtenersalonesServicios() {
            try {
                const response = await getSalonServicios();
                setsalonesServicios(response.data.datos);
            } catch (error) {
                console.error("Error al obtener los salonesServicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenersalonesServicios(); 
    }, [salonesServicios]);

    
    useEffect(() => {

        async function ObtenerSalones() {
            try {
                const response = await getSalones(); 
                setSalones(response.data.datos);
            } catch (error) {
                console.error("Error al obtener los salones:", error);
                setError("Error al obtener los datos.");
            }
        }
    
        ObtenerSalones();
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
        const idDelSalon = Number(data.salonId);
        const idDeServicio = Number(data.servicioId);
        const salonServicioData = { ...data, salonId: idDelSalon, servicioId: idDeServicio};
        try {
            if (salonServicioAEditar) {
                await updateSalonServicio(salonServicioAEditar.id, salonServicioData, auth);
                setsalonesServicios(salonesServicios.map(salonServicio => salonServicio.id === salonServicioAEditar.id 
                    ? { ...data, id: salonServicioAEditar.id } 
                    : salonServicio));
                setsalonServicioAEditar(null);  
            } else {
                const response = await createSalonServicio(salonServicioData, auth);
                setsalonesServicios([...salonesServicios, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            setError(salonServicioAEditar ? "Error al actualizar el salonServicio." : "Error al crear el salonServicio.");
        }
    };


    const handleDeleteSalonServicio = (salonServicioId) => {
        setsalonServicioAEliminar(salonServicioId);
        setShowConfirmDialog(true);
    };

    const handleEditSalonServicio = (salonServicio) => {
        setsalonServicioAEditar(salonServicio);
        setFormVisible(true);

        Object.keys(salonServicio).forEach((key) => {
            setValue(key, salonServicio[key]);
        });
    };

    const confirmarDeleteSalonServicio = async () => {
        try {
            await deleteSalonServicio(salonServicioAEliminar, auth);
            setsalonesServicios(salonesServicios.filter(salonServicio => salonServicio.id !== salonServicioAEliminar));
            setsalonServicioAEliminar(null); 
            setshowsalonesServicios(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar el salonServicio:", error);
            setError("Error al eliminar el salonServicio.");
        }
    };

    const cancelarDeleteSalonServicio = () => {
        setsalonServicioAEliminar(null); 
        setshowsalonesServicios(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>SALONES - SERVICIOS</h1> 
                <hr/>
                <br/>
                {showsalonesServicios && !formVisible && !salonServicioAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear vinculo Salon - Servicio
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{salonServicioAEditar ? "Editar vinculo Salon - Servicio" : "Alta vinculo Salon - Servicio"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="salonId" className="mb-3">
                                <Form.Label>Salón</Form.Label>
                                <Form.Select
                                    {...register("salonId")}
                                    isInvalid={!!errors.salonId}
                                >
                                <option value="">Selecciona un salón</option>
                                    {salones.map((salon) => (
                                        <option key={salon.id} value={salon.id}>
                                        {salon.nombre} 
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
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setsalonServicioAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showsalonesServicios && !formVisible && salonesServicios && (
                    <div>
                        {salonesServicios.map((salonServicio) => {
                            const salonNombre = salones.find(salon => salon.id === salonServicio.salonId)?.nombre || "Desconocido";
                            const servicioNombre = servicios.find(servicio => servicio.id === salonServicio.servicioId)?.nombre || "Desconocido";
                            return (
                                <div key={salonServicio.id}>
                                    <hr />
                                    <ul>
                                        <li>Salon: {salonNombre}</li>
                                        <li>Servicio: {servicioNombre}</li>
                                        <li>Precio: {salonServicio.precio}</li>
                                    </ul>
                                    <Button variant="danger" onClick={() => handleDeleteSalonServicio(salonServicio.id)}>Eliminar</Button>
                                    <Button variant="warning" className="ms-2" onClick={() => handleEditSalonServicio(salonServicio)}>Editar</Button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {salonServicioAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteSalonServicio}
                        onCancel={cancelarDeleteSalonServicio}
                    />
                )}
            </Container>
        </>
    );
}