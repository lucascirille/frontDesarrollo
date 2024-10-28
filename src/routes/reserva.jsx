import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useEffect, useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import anime from 'animejs';
import '../styles/reserva.css';
import { getSalones } from '../helpers/salones/salonesService';
import { createReserva, getFechasOcupadas } from '../helpers/reserva/reservaService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { parseISO, startOfDay } from 'date-fns';

const initialSchema = yup.object().shape({
  titulo: yup.string().required("El nombre es obligatorio"),
  fecha: yup.date().required("La fecha es obligatoria").min(new Date(), "La fecha no puede ser en el pasado"),
  franjaHoraria: yup.string().required("El nombre es obligatorio"),
  horaExtra: yup.boolean().required(),
  cantidadPersonas: yup.number().positive().integer().required("La cantidad de personas es obligatoria").min(20,"Minimo se requieren 20 invitados"),
  salonId: yup.string().required("Debes seleccionar un tipo de evento"),
});

export default function Reserva() {
    
  const { userId } = useContext(AuthContext);
  const formRef = useRef(null);
  const [salones, setSalones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [salonSeleccionado, setSalonSeleccionado] = useState('');
  const [franjaHorariaSeleccionada, setFranjaHorariaSeleccionada] = useState('');
  const [schema, setSchema] = useState(initialSchema); 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {

    const idDelSalon = Number(data.salonId);
    console.log(fechaSeleccionada);
    const formattedDate = fechaSeleccionada.toISOString().split('T')[0];
    console.log("data formateada", formattedDate);

    const reservacionData = { ...data, fecha: formattedDate, salonId: idDelSalon, usuarioId: userId };
    console.log("Datos de la reservacion", reservacionData);

    try {
        console.log("estoy en el submit", reservacionData);
        const response = await createReserva(reservacionData);
        reset();
        setError("");
        setShowModal(true);
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        setError(error.message || "Error desconocido. Intenta nuevamente.");
    }

    setShowModal(true);
  };

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
    
    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 1000,
      easing: 'easeOutQuad',
    });

    ObtenerSalones();
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

  useEffect(() => {
    if (salonSeleccionado && franjaHorariaSeleccionada) {
      async function obtenerFechasOcupadas() {
        try {
          const response = await getFechasOcupadas(parseInt(salonSeleccionado), franjaHorariaSeleccionada);
          console.log("Esta es mi respuesta" , response.data.datos);

          if (response.data.datos && response.data.datos.length > 0) {

            const fechas = response.data.datos.map(fecha => startOfDay(parseISO(fecha)));

            setFechasOcupadas(fechas);
            console.log("Esta es mi nueva respuesta", fechas);
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
  }, [salonSeleccionado, franjaHorariaSeleccionada]);

  //para desabilitar las fechas
  const isDayDisabled = (date) => {
    return fechasOcupadas.some((fecha) => new Date(fecha).toDateString() === date.toDateString());
  };

  const handleConfirmarReserva = () => {
    navigate('/'); 
  };

  const handleAgregarServicios = () => {
    navigate('/reservaServicios');
  };


  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() + 2);

  return (
    <>
      <div className="header-container">
        <header>
          <h1>Reservas</h1>
        </header>
      </div>
      <Container id="reserva" className="reserva-container my-5">
        <header>
          <h1 className="text-center mb-4">Reserva tu evento</h1>
        </header>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
              <Form.Group controlId="titulo" className="mb-3">
                <Form.Label>Titulo de tu evento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="titulo de tu evento"
                  {...register("titulo")}
                  isInvalid={!!errors.titulo}
                />
              </Form.Group>

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

              <Button variant="primary" type="submit" className="w-100">
                Continuar
              </Button>
            </Form>
            {error && (
              <Alert variant="danger" className="mt-3">
                {error.message}
              </Alert>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Deseas confirmar esta reserva o agregar servicios adicionales?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAgregarServicios}>
            Agregar Servicios
          </Button>
          <Button variant="primary" onClick={handleConfirmarReserva}>
            Confirmar Reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
