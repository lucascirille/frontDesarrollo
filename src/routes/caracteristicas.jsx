import { useState, useEffect } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getCaracteristicas, createCaracteristica, deleteCaracteristica, updateCaracteristica } from '../helpers/caracteristicas/caracteristicasService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import '../styles/salonesForm.css'
import '../styles/errors.css'

const schema = yup.object({
    nombre: yup.string().required("Este campo es obligatorio"),
    descripcion: yup.string().required("Este campo es obligatorio"),
    estado: yup.boolean().required(),
  }).required();

export default function Caracteristicas() {
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [caracteristicaAEditar, setCaracteristicaAEditar] = useState(null);
    const [caracteristicaAEliminar, setcaracteristicaAEliminar] = useState(null);
    const [showCaracteristicas, setShowCaracteristicas] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        async function ObtenerCaracteristicas() {
            try {
                const response = await getCaracteristicas();
                setCaracteristicas(response.data.datos);
            } catch (error) {
                console.error("Error al obtener las caracteristicas:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerCaracteristicas(); 
    }, [caracteristicas]);

    const onSubmit = async (data) => {
        try {
            if (caracteristicaAEditar) {
                await updateCaracteristica(caracteristicaAEditar.id, data);
                setCaracteristicas(caracteristicas.map(caracteristica => caracteristica.id === caracteristicaAEditar.id 
                    ? { ...data, id: caracteristicaAEditar.id } 
                    : caracteristica));
                setCaracteristicaAEditar(null);   
            } else {
                console.log(data);
                const response = await createCaracteristica(data);
                setCaracteristicas([...caracteristicas, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            if (error.message === "La caracteristica que intenta crear ya existe" || error.message === "Ya existe una caracteristica con el mismo nombre. Elija otro nombre."){
                console.error('Error al crear:', error);
                setError("nombre", { type: "manual", message: "La característica que intenta crear ya existe" });
            } else {
                console.error("Error:", error);
                setError("form", { type: "manual", message: "Error al crear la característica." });
            }
        }
    };


    const handleDeleteCaracteristica = (caracteristicaId) => {
        setcaracteristicaAEliminar(caracteristicaId);
        setShowConfirmDialog(true);
    };

    const handleEditCaracteristica = (caracteristica) => {
        setCaracteristicaAEditar(caracteristica);
        setFormVisible(true);

        Object.keys(caracteristica).forEach((key) => {
            setValue(key, caracteristica[key]);
        });
    };

    const confirmarDeleteCaracteristica = async () => {
        try {
            await deleteCaracteristica(caracteristicaAEliminar);
            setCaracteristicas(caracteristicas.filter(caracteristica => caracteristica.id !== caracteristicaAEliminar));
            setcaracteristicaAEliminar(null); 
            setShowCaracteristicas(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar la caracteristica:", error);
            setError("Error al eliminar la caracteristica.");
        }
    };

    const cancelarDeleteCaracteristica = () => {
        setcaracteristicaAEliminar(null); 
        setShowCaracteristicas(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>CARACTERISTICAS</h1> 
                <hr/>
                <br/>
                {showCaracteristicas && !formVisible && !caracteristicaAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear Caracteristica
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{caracteristicaAEditar ? "Editar Caracteristica" : "Alta Caracteristica"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre de la Caracteristica</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre de la caracteristica"
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
                                Guardar Caracteristica
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setCaracteristicaAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showCaracteristicas && !formVisible && caracteristicas && (
                    <div>
                        {caracteristicas.map((caracteristica) => (
                            <div key={caracteristica.id}>
                                <hr />
                                <h3>{caracteristica.nombre}</h3>
                                <ul>
                                    <li>Descripcion: {caracteristica.descripcion}</li>
                                    <li>Estado: {caracteristica.estado ? "Activa" : "Inactiva"}</li>
                                </ul>
                                <Button variant="danger" onClick={() => handleDeleteCaracteristica(caracteristica.id)}>Eliminar</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleEditCaracteristica(caracteristica)}>Editar</Button>
                            </div>
                        ))}
                    </div>
                )}

                {caracteristicaAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteCaracteristica}
                        onCancel={cancelarDeleteCaracteristica}
                    />
                )}
            </Container>
        </>
    );
}