import { Container, Row, Col, Form, Button, Modal, Alert } from 'react-bootstrap';
import { useEffect, useRef, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import anime from 'animejs';
import '../styles/reserva.css';
import { getSalones } from '../helpers/salones/salonesService';
import { createReserva } from '../helpers/reserva/reservaService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const schema = yup.object().shape({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {

    const idDelSalon = Number(data.salonId);
    console.log("data", data.fecha);
    const formattedDate = data.fecha.toISOString().split('T')[0];
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

  const handleConfirmarReserva = () => {
    navigate('/'); 
  };

  const handleAgregarServicios = () => {
    navigate('/reservaServicios');
  };

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
              
              <Form.Group controlId="fecha" className="mb-3">
                <Form.Label>Fecha del Evento</Form.Label>
                <Form.Control
                  type="date"
                  {...register("fecha")}
                  isInvalid={!!errors.fecha}
                />
              </Form.Group>

              <Form.Group controlId="franjaHoraria" className="mb-3">
                <Form.Label>Franja Horaria</Form.Label>
                <Form.Select
                    {...register("franjaHoraria")}
                    isInvalid={!!errors.franjaHoraria}
                    >
                    <option value="">Selecciona una franja horaria</option>
                    <option value="Mediodia">Mediodía</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                </Form.Select>
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
              </Form.Group>

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
