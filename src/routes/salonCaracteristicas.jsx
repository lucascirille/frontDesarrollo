import { useState, useEffect, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getSalonCaracteristicas, createSalonCaracteristica, deleteSalonCaracteristica, updateSalonCaracteristica } from '../helpers/salonCaracteristicas/salonesCaracteristicasService';
import { getSalones } from '../helpers/salones/salonesService';
import { getCaracteristicas } from '../helpers/caracteristicas/caracteristicasService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { AuthContext } from '../context/AuthContext';
import '../styles/salonesForm.css' 
import '../styles/errors.css'

const schema = yup.object({
    salonId: yup.string().required("Este campo es obligatorio"),
    caracteristicaId: yup.string().required("Este campo es obligatorio"),
    valor: yup.number().transform((value) => (isNaN(value) ? undefined : value)).positive("debe ser un valor positivo").integer().max(9999, "El valor no puede exceder 4 dígitos").required("Este campo es obligatorio"),
  }).required();

export default function SalonCaracteristicas() {
    const { auth } = useContext(AuthContext);
    const [salonesCaracteristicas, setsalonesCaracteristicas] = useState([]);
    const [salonCaracteristicaAEditar, setsalonCaracteristicaAEditar] = useState(null);
    const [salonCaracteristicaAEliminar, setsalonCaracteristicaAEliminar] = useState(null);
    const [showsalonesCaracteristicas, setshowsalonesCaracteristicas] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [salones, setSalones] = useState([]);
    const [caracteristicas, setCaracteristicas] = useState([]);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
      });

    useEffect(() => {
        async function ObtenersalonesCaracteristicas() {
            try {
                const response = await getSalonCaracteristicas();
                setsalonesCaracteristicas(response.data.datos);
            } catch (error) {
                console.error("Error al obtener los salonesCaracteristicas:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenersalonesCaracteristicas(); 
    }, [salonesCaracteristicas]);

    
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
        async function ObtenerCaracteristicas() {
            try {
                const response = await getCaracteristicas();
                setCaracteristicas(response.data.datos);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener las caracteristicas:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerCaracteristicas(); 
    }, []);

    const onSubmit = async (data) => {
        const idDelSalon = Number(data.salonId);
        const idDeCaracteristica = Number(data.caracteristicaId);
        const salonCaracteristicaData = { ...data, salonId: idDelSalon, caracteristicaId: idDeCaracteristica};
        try {
            if (salonCaracteristicaAEditar) {
                await updateSalonCaracteristica(salonCaracteristicaAEditar.id, salonCaracteristicaData, auth);
                setsalonesCaracteristicas(salonesCaracteristicas.map(salonCaracteristica => salonCaracteristica.id === salonCaracteristicaAEditar.id 
                    ? { ...data, id: salonCaracteristicaAEditar.id } 
                    : salonCaracteristica));
                setsalonCaracteristicaAEditar(null);  
            } else {
                const response = await createSalonCaracteristica(salonCaracteristicaData, auth);
                setsalonesCaracteristicas([...salonesCaracteristicas, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            console.log("Mensaje de error", error.message);
            setError(salonCaracteristicaAEditar ? "Error al actualizar el salonCaracteristica." : "Error al crear el salonCaracteristica.");
        }
    };


    const handleDeleteSalonCaracteristica = (salonCaracteristicaId) => {
        setsalonCaracteristicaAEliminar(salonCaracteristicaId);
        setShowConfirmDialog(true);
    };

    const handleEditSalonCaracteristica = (salonCaracteristica) => {
        setsalonCaracteristicaAEditar(salonCaracteristica);
        setFormVisible(true);

        Object.keys(salonCaracteristica).forEach((key) => {
            setValue(key, salonCaracteristica[key]);
        });
    };

    const confirmarDeleteSalonCaracteristica = async () => {
        try {
            await deleteSalonCaracteristica(salonCaracteristicaAEliminar, auth);
            setsalonesCaracteristicas(salonesCaracteristicas.filter(salonCaracteristica => salonCaracteristica.id !== salonCaracteristicaAEliminar));
            setsalonCaracteristicaAEliminar(null); 
            setshowsalonesCaracteristicas(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar el salonCaracteristica:", error);
            setError("Error al eliminar el salonCaracteristica.");
        }
    };

    const cancelarDeleteSalonCaracteristica = () => {
        setsalonCaracteristicaAEliminar(null); 
        setshowsalonesCaracteristicas(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>SALONES - CARACTERISTICAS</h1> 
                <hr/>
                <br/>
                {showsalonesCaracteristicas && !formVisible && !salonCaracteristicaAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear vinculo Salon - Caracteristica
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{salonCaracteristicaAEditar ? "Editar vinculo Salon - Caracteristica" : "Alta vinculo Salon - Caracteristica"}</h2>
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
                                <Form.Group controlId="caracteristicaId" className="mb-3">
                                <Form.Label>Caracteristica</Form.Label>
                                <Form.Select
                                    {...register("caracteristicaId")}
                                    isInvalid={!!errors.caracteristicaId}
                                >
                                <option value="">Selecciona una caracteristica</option>
                                    {caracteristicas.map((caracteristica) => (
                                        <option key={caracteristica.id} value={caracteristica.id}>
                                        {caracteristica.nombre} 
                                        </option>
                                    ))}
                                </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col>
                            <Form.Group controlId="valor" className="mb-3">
                                <Form.Label>Valor</Form.Label>
                                <Form.Control
                                type="number"
                                placeholder="Valor"
                                {...register("valor")}
                                isInvalid={!!errors.valor}
                                />
                                {errors.valor && <p className="error-message">{errors.valor.message}</p>}
                            </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Guardar Vinculo
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setsalonCaracteristicaAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )} 

                {showsalonesCaracteristicas && !formVisible && salonesCaracteristicas && (
                    <div>
                        {salonesCaracteristicas.map((salonCaracteristica) => {
                            const salonNombre = salones.find(salon => salon.id === salonCaracteristica.salonId)?.nombre || "Desconocido";
                            const caracteristicaNombre = caracteristicas.find(caracteristica => caracteristica.id === salonCaracteristica.caracteristicaId)?.nombre || "Desconocido";
                            return (
                                <div key={salonCaracteristica.id}>
                                    <hr />
                                    <ul>
                                        <li>Salon: {salonNombre}</li>
                                        <li>Caracteristica: {caracteristicaNombre}</li>
                                        <li>Valor: {salonCaracteristica.valor}</li>
                                    </ul>
                                    <Button variant="danger" onClick={() => handleDeleteSalonCaracteristica(salonCaracteristica.id)}>Eliminar</Button>
                                    <Button variant="warning" className="ms-2" onClick={() => handleEditSalonCaracteristica(salonCaracteristica)}>Editar</Button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {salonCaracteristicaAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteSalonCaracteristica}
                        onCancel={cancelarDeleteSalonCaracteristica}
                    />
                )}
            </Container>
        </>
    );
}