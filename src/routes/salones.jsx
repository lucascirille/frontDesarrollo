import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getSalones,createSalon,deleteSalon,updateSalon } from "../helpers/salones/salonesService";
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import '../styles/salonesForm.css'

const schema = yup.object({
    nombre: yup.string().required(),
    tipo: yup.string().required(),
    estado: yup.boolean().required(),
    telefono: yup.string()
    .required()
    .matches(/^\+?[0-9\s-]{10,15}$/),
    capacidad: yup.number().positive().integer().required(),
    dimensionesMt2: yup.number().positive().required(),
    precioBase: yup.number().positive().required(),
    precioHora: yup.number().positive().required(),
    direccion: yup.string().required(),
    localidad: yup.string().required(),
  }).required();

export default function Salones() {
    
    const [salones, setSalones] = useState([]);
    const [salonAEliminar, setSalonAEliminar] = useState(null);
    const [salonAEditar, setSalonAEditar] = useState(null);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSalones, setShowSalones] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
      }); 

    useEffect(() => {
        async function ObtenerSalones() {
            try {
                const response = await getSalones();
                setSalones(response.data.datos);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener los salones:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerSalones(); 
    }, []);

    const onSubmit = async (data) => {
        try {
            if (salonAEditar) {
                await updateSalon(salonAEditar.id, data);
                setSalones(salones.map(salon => salon.id === salonAEditar.id ? data : salon));
                setSalonAEditar(null);  
            } else {
                const response = await createSalon(data);
                setSalones([...salones, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            setError(salonAEditar ? "Error al actualizar el salón." : "Error al crear el salón.");
        }
    };


    const handleDeleteSalon = (salonId) => {
        setSalonAEliminar(salonId);
        setShowConfirmDialog(true);
    };

    const handleEditSalon = (salon) => {
        setSalonAEditar(salon);
        setFormVisible(true);

        Object.keys(salon).forEach((key) => {
            setValue(key, salon[key]);
        });
    };



    const confirmarDeleteSalon = async () => {
            try {
                await deleteSalon(salonAEliminar);
                setSalones(salones.filter(salon => salon.id !== salonAEliminar));
                setSalonAEliminar(null); 
                setShowSalones(true);
                setShowConfirmDialog(false);
            } catch (error) {
                console.error("Error al eliminar el salón:", error);
                setError("Error al eliminar el salón.");
            }
    };

    const cancelarDeleteSalon = () => {
        setSalonAEliminar(null); 
        setShowSalones(true);
        setShowConfirmDialog(false);
    };

    return (
        <>
            <Container>
                {showSalones && !formVisible && !salonAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear Salón
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{salonAEditar ? "Editar Salón" : "Alta Salón"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre del Salón</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre del salón"
                                        {...register("nombre")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="tipo">
                                    <Form.Label>Tipo de Salón</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tipo del salón"
                                        {...register("tipo")}
                                    />
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

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="telefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Teléfono"
                                        {...register("telefono")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="capacidad">
                                    <Form.Label>Capacidad del Salón</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Capacidad"
                                        {...register("capacidad")}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="dimensionesMt2">
                                    <Form.Label>Dimensiones (m²)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01" 
                                        placeholder="Dimensiones en m²"
                                        {...register("dimensionesMt2")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="precioBase">
                                    <Form.Label>Precio Base</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01" 
                                        placeholder="Precio Base"
                                        {...register("precioBase")}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="precioHora">
                                    <Form.Label>Precio por Hora</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01" 
                                        placeholder="Precio por Hora"
                                        {...register("precioHora")}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="direccion">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Dirección"
                                        {...register("direccion")}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group controlId="localidad" className="mb-3">
                            <Form.Label>Localidad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Localidad"
                                {...register("localidad")}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Guardar Salón
                        </Button>
                        <Button variant="secondary" className="ms-2" onClick={() => {setFormVisible(false); setSalonAEditar(null); reset();}}>
                            Cancelar
                        </Button>
                    </Form>
                    </>
            )}

            {showSalones && !formVisible && salones && (
                <div>
                    {salones.map((salon) => (
                        <div key={salon.id}>
                            <hr />
                            <h3>{salon.nombre}</h3>
                            <ul>
                                <li>Tipo: {salon.tipo}</li>
                                <li>Estado: {salon.estado ? "Activo" : "Inactivo"}</li>
                                <li>Teléfono: {salon.telefono}</li>
                                <li>Capacidad: {salon.capacidad}</li>
                                <li>Dimensiones (m²): {salon.dimensionesMt2}</li>
                                <li>Precio Base: {salon.precioBase}</li>
                                <li>Precio por Hora: {salon.precioHora}</li>
                                <li>Dirección: {salon.direccion}</li>
                                <li>Localidad: {salon.localidad}</li>
                            </ul>
                            <Button variant="danger" onClick={() => handleDeleteSalon(salon.id)}>Eliminar</Button>
                            <Button variant="warning" className="ms-2" onClick={() => handleEditSalon(salon)}>Editar</Button>
                        </div>
                    ))}
                </div>
            )}

            {salonAEliminar && (
                <ConfirmarEliminacion
                    show={showConfirmDialog} 
                    onConfirm={confirmarDeleteSalon}
                    onCancel={cancelarDeleteSalon}
                />
            )}
            </Container>
        </>

    );
}