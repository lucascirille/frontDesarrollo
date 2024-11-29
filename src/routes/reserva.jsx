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
import Footer from './components/footer';
import { getDescuento } from '../helpers/apisDeTerceros/cupones'

const initialSchema = yup.object().shape({
  titulo: yup.string().required("El nombre es obligatorio"),
  fecha: yup.date().required("La fecha es obligatoria").min(new Date(), "La fecha no puede ser la de hoy o estar en el pasado"),
  franjaHoraria: yup.string().required("El nombre es obligatorio"),
  horaExtra: yup.boolean().required(),
  cantidadPersonas: yup
  .number("El campo es requerido")
  .transform((value) => (isNaN(value) ? undefined : value))
  .positive("La cantidad de personas debe ser un número positivo")
  .integer("La cantidad de personas debe ser un número entero")
  .min(20,"Minimo se requieren 20 invitados")
  .required("La cantidad de personas es obligatoria"),
  salonId: yup.string().required("Debes seleccionar un tipo de evento"),
}); 

export default function Reserva() {
    
  const { userId, auth } = useContext(AuthContext);
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
  const [precioSalon, setPrecioSalon] = useState(0);
  const [precioHoraExtra, setPrecioHoraExtra] = useState(0); 
  const [presupuestoTotal, setPresupuestoTotal] = useState(0);
  const [nombreReserva, setNombreReserva] = useState('');
  const [fechaReserva, setFechaReserva] = useState('');
  const [cupon, setCupon] = useState('');
  const [descuento, setDescuento] = useState('');
  const [mensajeCupon, setMensajeCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
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
        const response = await createReserva(reservacionData, auth);
        reset();
        setError("");
        setShowModal(true);
        setNombreReserva(data.titulo);
        setFechaReserva(formattedDate);
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        setError(error.message);
    }

    
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
        .transform((value) => (isNaN(value) ? undefined : value))
        .positive()
        .integer()
        .min(20, "Mínimo se requieren 20 invitados")
        .max(capacidad, `La capacidad máxima del salón es ${capacidad} personas`)
        .required("La cantidad de personas es obligatoria");

        const updatedSchema = initialSchema.concat(
          yup.object().shape({
            cantidadPersonas: cantidadPersonasSchema,
          })
        );

        setSchema(updatedSchema);
        setPrecioSalon(salon.precioBase);
        setPrecioHoraExtra(salon.precioHora);
      }
    }
  }, [salonSeleccionado, salones]);

  useEffect(() => {
    const total = precioSalon + (watch('horaExtra') ? precioHoraExtra : 0);
    setPresupuestoTotal(total);
  }, [precioSalon, watch('horaExtra')]);
  

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
    const idDelSalon = parseInt(salonSeleccionado);

    navigate('/reservaServicios',
    {
      state: { salonId: idDelSalon, nombreReserva, fechaReserva }
    });
  };


  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() + 2);

  const validarCupon = async () => {
    if (cuponAplicado) {
      setMensajeCupon("Ya se ha aplicado un cupón para esta reserva.");
      return;
    }

    try {
      const respuesta = await getDescuento(cupon);
      console.log("Respuesta", respuesta);
      const cuponData = JSON.parse(respuesta);
  
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaVencimiento = (() => {
        const partes = cuponData.vencimiento.split("-");
        return new Date(partes[0], partes[1] - 1, partes[2]); // Año, Mes (0 indexado), Día
      })();
  
      if (cuponData.utilizado) {
        setMensajeCupon("El cupón ya ha sido utilizado.");
        setDescuento(0);
      } else if (fechaVencimiento < hoy) {
        setMensajeCupon("El cupón está vencido.");
        setDescuento(0);
      } else {
        const descuentoAplicado = cuponData.descuento;
        setMensajeCupon(`Cupón válido. Se aplicará un ${cuponData.descuento}% de descuento.`);
        setDescuento(cuponData.descuento);

        const nuevoPresupuesto = presupuestoTotal - (presupuestoTotal * descuentoAplicado) / 100;
        setPresupuestoTotal(nuevoPresupuesto);
        setCuponAplicado(true);
      }
    } catch (error) {
      const errorData = JSON.parse(error); // Analiza el error en formato JSON
      setMensajeCupon(errorData.error);
      setDescuento(0);
    }
  };
  
 

  return (
    <>
      <div className="header-container">
        <header>
          <h1>Reservas</h1>
          {error && <p>No es posible reservar en este momento</p>}
        </header>
      </div>

      {!error && (
      <>
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
                  {error && <div className="invalid-feedback d-block">{error}</div>}
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

                <hr />

                <div>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}> PRECIO SALON: ${precioSalon} </p>
                </div>

                <hr />

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

                  <hr />

                <div>
                  <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}> PRECIO HORA EXTRA: ${precioHoraExtra} </p>
                </div>

                <hr />

                <Form.Group controlId="cantidadPersonas" className="mb-3">
                  <Form.Label>Cantidad de Personas</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="cantidad de personas"
                    {...register("cantidadPersonas")}
                  />
                  {errors.cantidadPersonas && (
                    <p className="error-message">{errors.cantidadPersonas.message}</p>
                  )}
                </Form.Group>
                <Form.Group controlId="cupon" className="mb-3">
                  <Form.Label>Cupón de Descuento</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Ingresa tu cupón"
                      value={cupon}
                      onChange={(e) => setCupon(e.target.value)}
                      className="me-2"
                      disabled={cuponAplicado}
                    />
                    <Button variant="secondary" onClick={validarCupon}>
                      Validar
                    </Button>
                  </div>
                  <div>{mensajeCupon && (
                      <p style={{ color: mensajeCupon.includes("válido") ? "green" : "red", marginTop: "0.5rem" }}>
                        {mensajeCupon}
                      </p>
                    )}</div>
                </Form.Group>


                <hr />

                <div>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem", marginBottom: "1rem" }}> PRESUPUESTO TOTAL: ${presupuestoTotal.toFixed(2)} </p>
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Confirmar
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

      

        <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        backdrop="static" 
        keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Confirmar Reserva</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Deseas confirmar esta reserva o agregar servicios adicionales?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleConfirmarReserva}>
              Confirmar Reserva
            </Button>
            <Button variant="primary" onClick={handleAgregarServicios}>
              Agregar Servicios
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      )}
      <Footer />
    </>
  );
}
