import { useState, useEffect } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getServicios, createServicio, deleteServicio, updateServicio } from '../helpers/servicios/serviciosService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import '../styles/salonesForm.css'
import '../styles/errors.css'

const schema = yup.object({ 
    nombre: yup.string().required("Este campo es obligatorio"),
    descripcion: yup.string().required("Este campo es obligatorio"),
    estado: yup.boolean().required(),
  }).required();

export default function Servicios() {
    const [servicios, setServicios] = useState([]);
    const [servicioAEditar, setServicioAEditar] = useState(null);
    const [servicioAEliminar, setServicioAEliminar] = useState(null);
    const [showServicios, setShowServicios] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        async function ObtenerServicios() {
            try {
                const response = await getServicios();
                setServicios(response.data.datos);
            } catch (error) {
                console.error("Error al obtener los servicios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerServicios(); 
    }, [servicios]);

    const onSubmit = async (data) => {
        try {
            if (servicioAEditar) {
                await updateServicio(servicioAEditar.id, data);
                setServicios(servicios.map(servicio => servicio.id === servicioAEditar.id 
                    ? { ...data, id: servicioAEditar.id } 
                    : servicio));
                setServicioAEditar(null);  
            } else {
                console.log(data);
                const response = await createServicio(data);
                setServicios([...servicios, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            if (error.message === "El servicio que intenta crear ya existe" || error.message === "Ya existe un servicio con el mismo nombre. Elija otro nombre."){
                console.error('Error al crear:', error);
                setError("nombre", { type: "manual", message: "El servicio que intenta crear ya existe" });
            } else {
                console.error("Error:", error);
                setError("form", { type: "manual", message: "Error al crear el servicio." });
            }
        }
    };


    const handleDeleteServicio = (servicioId) => {
        setServicioAEliminar(servicioId);
        setShowConfirmDialog(true);
    };

    const handleEditServicio = (servicio) => {
        setServicioAEditar(servicio);
        setFormVisible(true);

        Object.keys(servicio).forEach((key) => {
            setValue(key, servicio[key]);
        });
    };

    const confirmarDeleteServicio = async () => {
        try {
            await deleteServicio(servicioAEliminar);
            setServicios(servicios.filter(servicio => servicio.id !== servicioAEliminar));
            setServicioAEliminar(null); 
            setShowServicios(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar el servicio:", error);
            setError("Error al eliminar el servicio.");
        }
    };

    const cancelarDeleteServicio = () => {
        setServicioAEliminar(null); 
        setShowServicios(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>SERVICIOS</h1> 
                <hr/>
                <br/>
                {showServicios && !formVisible && !servicioAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear Servicio
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{servicioAEditar ? "Editar Servicio" : "Alta Servicio"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre del Servicio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre del Servicio"
                                        {...register("nombre")}
                                    />
                                    {errors.nombre && <p className="error-message">{errors.nombre.message}</p>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="descripcion">
                                    <Form.Label>Descripcion</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Descripcion"
                                        {...register("descripcion")}
                                    />
                                    {errors.descripcion && <p className="error-message">{errors.descripcion.message}</p>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="estado" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="¿Publicar?"
                                {...register("estado")}
                            />
                        </Form.Group>
                        
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Guardar Servicio
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setServicioAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showServicios && !formVisible && servicios && (
                    <div>
                        {servicios.map((servicio) => (
                            <div key={servicio.id}>
                                <hr />
                                <h3>{servicio.nombre}</h3>
                                <ul>
                                    <li>Descripcion: {servicio.descripcion}</li>
                                    <li>Estado: {servicio.estado ? "Activo" : "Inactivo"}</li>
                                </ul>
                                <Button variant="danger" onClick={() => handleDeleteServicio(servicio.id)}>Eliminar</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleEditServicio(servicio)}>Editar</Button>
                            </div>
                        ))}
                    </div>
                )}

                {servicioAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteServicio}
                        onCancel={cancelarDeleteServicio}
                    />
                )}
            </Container>
        </>
    );
}