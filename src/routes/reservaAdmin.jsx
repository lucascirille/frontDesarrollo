import { useState, useEffect, useContext } from "react"; 
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getReservas, createReserva, deleteReserva, updateReserva, getFechasOcupadas } from '../helpers/reserva/reservaService';
import { getSalones } from '../helpers/salones/salonesService';
import { getUsuarios } from '../helpers/usuarios/usuariosService';
import ConfirmarEliminacion from "./components/confirmarEliminacion";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import { AuthContext } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import { parseISO, startOfDay, format } from 'date-fns';
import '../styles/salonesForm.css'
import '../styles/errors.css'

const initialSchema = yup.object().shape({
    titulo: yup.string().required("El nombre es obligatorio"),
    fecha: yup.date().required("La fecha es obligatoria").min(new Date(), "La fecha no puede ser en el pasado"),
    franjaHoraria: yup.string().required("El nombre es obligatorio"),
    horaExtra: yup.boolean().required(),
    cantidadPersonas: yup.number().positive().integer().required("La cantidad de personas es obligatoria").min(20,"Minimo se requieren 20 invitados"),
    salonId: yup.string().required("Debes seleccionar un tipo de evento"),
    usuarioId: yup.string().required("Debes seleccionar un usuario"),
  });

export default function ReservaAdmin() {
    const { auth } = useContext(AuthContext);
    const [reservas, setReservas] = useState([]);
    const [reservaAEditar, setReservaAEditar] = useState(null);
    const [reservaAEliminar, setReservaAEliminar] = useState(null);
    const [salones, setSalones] = useState([]);
    const [salonSeleccionado, setSalonSeleccionado] = useState('');
    const [fechasOcupadas, setFechasOcupadas] = useState([]);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [franjaHorariaSeleccionada, setFranjaHorariaSeleccionada] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const [showReservas, setShowReservas] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [schema, setSchema] = useState(initialSchema);
    const { register, handleSubmit, reset, setValue, setError, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

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
    }, [reservas]);

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
        async function ObtenerUsuarios() {
            try {
                const response = await getUsuarios();
                setUsuarios(response.data.datos);
                console.log(response.data);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerUsuarios(); 
    }, []);

    useEffect(() => {
        if (salonSeleccionado) {
          const salon = salones.find(salon => salon.id === parseInt(salonSeleccionado));
          if (salon) {
            const capacidad = salon.capacidad;
    
            const cantidadPersonasSchema = yup
            .number()
            .positive()
            .integer()
            .required("La cantidad de personas es obligatoria")
            .min(20, "Mínimo se requieren 20 invitados")
            .max(capacidad, `La capacidad máxima del salón es ${capacidad} personas`);
    
            const updatedSchema = initialSchema.concat(
              yup.object().shape({
                cantidadPersonas: cantidadPersonasSchema,
              })
            );
    
            setSchema(updatedSchema);
          }
        }
    }, [salonSeleccionado, salones]);

    const onSubmit = async (data) => {

        const idDelSalon = Number(data.salonId);
        const idDelUsuario = Number(data.usuarioId);
        console.log(fechaSeleccionada);
        const formattedDate = fechaSeleccionada.toISOString().split('T')[0];
        console.log("data formateada", formattedDate);
    
        const reservacionData = { ...data, fecha: formattedDate, salonId: idDelSalon, usuarioId: idDelUsuario };
        console.log("Datos de la reservacion", reservacionData); 
    
        try {

            if (reservaAEditar) {
                const response = await updateReserva(reservaAEditar.id, reservacionData, auth);
                console.log("Estoy en editar", response);
                setReservas(reservas.map(reserva => reserva.id === reservaAEditar.id 
                    ? { ...reservacionData, id: reservaAEditar.id, fecha: response.data.datos.fecha} 
                    : reserva));
                setReservaAEditar(null);  
            } else {
                console.log(data);
                const response = await createReserva(reservacionData, auth);
                setReservas([...reservas, { ...response.data.datos }]);
            }
            reset();
            setFormVisible(false); 
        } catch (error) {
            console.log("Mensaje de error", error.message);
            if (error.message === "La reserva que intenta crear ya existe" || error.message === "Ya existe una reserva con el mismo nombre. Elija otro nombre."){
                console.error('Error al crear:', error);
                setError("titulo", { type: "manual", message: "La reserva que intenta crear ya existe" });
            } else {
                console.error("Error:", error);
                setError("form", { type: "manual", message: "Error al crear la reserva." });
            }
        }
    };

    useEffect(() => {
    if (salonSeleccionado && franjaHorariaSeleccionada) {
        async function obtenerFechasOcupadas() {
        try {
            const response = await getFechasOcupadas(parseInt(salonSeleccionado), franjaHorariaSeleccionada);

            if (response.data.datos && response.data.datos.length > 0) {

            const fechas = response.data.datos.map(fecha => startOfDay(parseISO(fecha)));

            setFechasOcupadas(fechas);
            } else {
            console.warn("No hay fechas ocupadas para este salón.");
            setFechasOcupadas(fechas);
            console.log("estoy en el else", fechasOcupadas)
            
            }

        } catch (error) {
            console.error("Error al obtener las fechas ocupadas:", error);
            setFechasOcupadas([]);
            console.log("Este es mi array vacio", fechasOcupadas)
        }
        }
        obtenerFechasOcupadas();
    }
    }, [salonSeleccionado, franjaHorariaSeleccionada, reservas]);

    //para desabilitar las fechas
    const isDayDisabled = (date) => {
    return fechasOcupadas.some((fecha) => new Date(fecha).toDateString() === date.toDateString());
    };

    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() + 2);

    const handleDeleteReserva = (reservaId) => {
        setReservaAEliminar(reservaId);
        setShowConfirmDialog(true);
    };

    const handleEditReserva = (reserva) => {
        setReservaAEditar(reserva);
        setFormVisible(true);
    };

    const confirmarDeleteReserva = async () => {
        try {
            await deleteReserva(reservaAEliminar, auth);
            setReservas(reservas.filter(reserva => reserva.id !== reservaAEliminar));
            setReservaAEliminar(null); 
            setShowReservas(true);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Error al eliminar la reserva:", error);
            setError("Error al eliminar la reserva.");
        }
    };

    const cancelarDeleteReserva = () => {
        setReservaAEliminar(null); 
        setShowReservas(true);
        setShowConfirmDialog(false);
    };

    return(
        <>
            <Container>
                <h1>RESERVAS</h1>
                <hr/>
                <br/>
                {showReservas && !formVisible && !reservaAEditar && (
                    <Button variant="success" className="mb-3" onClick={() => setFormVisible(true)}>
                        Crear Reserva
                    </Button>
                )}

                {formVisible && (
                    <>
                    <h2>{reservaAEditar ? "Editar Reserva" : "Alta Reserva"}</h2>
                    <div className="separator"></div>
                    <br/>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="mb-3">
                            <Col>
                            <Form.Group controlId="titulo" className="mb-3">
                                <Form.Label>Titulo de tu evento</Form.Label>
                                <Form.Control
                                type="text"
                                placeholder="titulo de tu evento"
                                {...register("titulo")}
                                isInvalid={!!errors.titulo}
                                />
                                {errors.titulo && <div className="invalid-feedback d-block">{errors.titulo.message}</div>}
                            </Form.Group>
                            </Col>
                            <Col>
                            <Form.Group controlId="salonId" className="mb-3">
                                <Form.Label>Salón</Form.Label>
                                <Form.Select
                                {...register("salonId")}
                                isInvalid={!!errors.salonId}
                                onChange={(e) => setSalonSeleccionado(e.target.value)}
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
                        </Row>
                        <Row>
                            <Form.Group controlId="franjaHoraria" className="mb-3">
                                <Form.Label>Franja Horaria</Form.Label>
                                <Form.Select
                                    {...register("franjaHoraria")}
                                    isInvalid={!!errors.franjaHoraria}
                                    onChange={(e) => setFranjaHorariaSeleccionada(e.target.value)}
                                    >
                                    <option value="">Selecciona una franja horaria</option>
                                    <option value="Mediodia">Mediodía</option>
                                    <option value="Tarde">Tarde</option>
                                    <option value="Noche">Noche</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group controlId="fecha" className="mb-3">
                                <Form.Label>Fecha del Evento</Form.Label>
                                <DatePicker
                                selected={fechaSeleccionada}
                                onChange={(date) => {setFechaSeleccionada(date); setValue("fecha", date);}}
                                filterDate={(date) => !isDayDisabled(date)}
                                minDate={new Date()}
                                maxDate={fechaLimite}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                />
                                {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha.message}</div>}
                            </Form.Group>
                            <Form.Group controlId="horaExtra" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    label="Agregar hora extra"
                                    {...register("horaExtra")}
                                />
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group controlId="cantidadPersonas" className="mb-3">
                                <Form.Label>Cantidad de Personas</Form.Label>
                                <Form.Control
                                type="number"
                                placeholder="cantidad de personas"
                                {...register("cantidadPersonas")}
                                isInvalid={!!errors.cantidadPersonas}
                                />
                                {errors.cantidadPersonas && (
                                <div className="invalid-feedback d-block">
                                    {errors.cantidadPersonas.message}
                                </div>
                                )}
                            </Form.Group>
                            <Form.Group controlId="usuarioId" className="mb-3">
                                <Form.Label>Usuario</Form.Label>
                                <Form.Select
                                {...register("usuarioId")}
                                isInvalid={!!errors.usuarioId}
                                >
                                <option value="">Selecciona un usuario</option>
                                {usuarios.map((usuario) => (
                                    <option key={usuario.id} value={usuario.id}>
                                    {usuario.nombreUsuario} 
                                    </option>
                                ))}
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        
                        <div className="d-flex gap-2">
                            <Button variant="primary" type="submit">
                                Guardar Reserva
                            </Button>
                            <Button variant="primary" className="ms-2" onClick={() => {setFormVisible(false); setReservaAEditar(null); reset();}}>
                                Cancelar
                            </Button>
                        </div>
                    </Form>
                    </>
                )}

                {showReservas && !formVisible && reservas && (
                    <div>
                        {reservas.map((reserva) => (
                            <div key={reserva.id}>
                                <hr />
                                <h3>{reserva.titulo}</h3>
                                <ul>
                                    <li>Fecha: {reserva.fecha.split(" ")[0]}</li>
                                    <li>Franja Horaria: {reserva.franjaHoraria}</li>
                                    <li>Cantidad de Personas: {reserva.cantidadPersonas}</li>
                                    <li>salonId: {reserva.salonId}</li>
                                    <li>usuarioId: {reserva.usuarioId}</li>
                                </ul>
                                <Button variant="danger" onClick={() => handleDeleteReserva(reserva.id)}>Eliminar</Button>
                                <Button variant="warning" className="ms-2" onClick={() => handleEditReserva(reserva)}>Editar</Button>
                            </div>
                        ))}
                    </div>
                )}

                {reservaAEliminar && (
                    <ConfirmarEliminacion
                        show={showConfirmDialog} 
                        onConfirm={confirmarDeleteReserva}
                        onCancel={cancelarDeleteReserva}
                    />
                )}
            </Container>
        </> 
    );
}