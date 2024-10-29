import React, { useEffect, useState } from 'react';
import { GetReservasDeSalonesCorporativos } from '../helpers/reserva/reservaService'
import '../styles/coorporativos.css';
import imagenes from '../helpers/reserva/imagenes';

export default function Coorporativos() {
    const [reservasOriginales, setReservasOriginales] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const obtenerReservas = async () => {
            try {
                const response = await GetReservasDeSalonesCorporativos();
                console.log("Reservas sin filtrar", response.data.datos);

                const reservasFiltradas = response.data.datos.filter(data => {

                    const [fecha, hora] = data.fecha.split(" ");
                    const [dia, mes, año] = fecha.split("/");
                    console.log("Estos son las variables de la fecha", dia, mes, año);
                    const fechaReserva = new Date(Date.UTC(año, mes - 1, dia));
                    console.log("fecha reserva", fechaReserva.toISOString());
                    const fechaActual = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
                    console.log("fecha actual", fechaActual.toISOString());

                    return fechaReserva >= fechaActual;
                });

                console.log("Estas son las reservas filtradas", reservasFiltradas);
                setReservasOriginales(reservasFiltradas);
                setReservas(reservasFiltradas);
            } catch (err) {
                setError(err.message);
            }
        };
        obtenerReservas();
    }, []);

    const obtenerImagenAleatoria = () => {
        const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
        return imagenes[indiceAleatorio];
    };

    const mostrarEventosProximos = () => {
        setReservas(reservasOriginales);
    };

    const mostrarEventosEstaSemana = () => {
        const hoy = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
        const finDeSemana = new Date(hoy);
        finDeSemana.setUTCDate(hoy.getUTCDate() + (7 - hoy.getUTCDay()));

        const reservasSemana = reservasOriginales.filter(reserva => {
            const [fecha, hora] = reserva.fecha.split(" ");
            const [dia, mes, año] = fecha.split("/");
            const fechaReserva = new Date(Date.UTC(año, mes - 1, dia));
            return fechaReserva >= hoy && fechaReserva <= finDeSemana;
        });
        setReservas(reservasSemana);
    };

    const mostrarEventosEsteMes = () => {
        const hoy = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
        const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
        const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0));

        const reservasMes = reservasOriginales.filter(reserva => {
            const [fecha, hora] = reserva.fecha.split(" ");
            const [dia, mes, año] = fecha.split("/");
            const fechaReserva = new Date(Date.UTC(año, mes - 1, dia));
            return fechaReserva >= inicioMes && fechaReserva <= finMes;
        });
        setReservas(reservasMes);
    };

    return(
        <>
            <div id="home" className="coorporativos-container">
                <header >
                    <h1>Eventos Corporativos</h1>
                </header>
            </div>
            <h3>Todos los eventos corporativos</h3>

            {error && <p className="text-danger">{error}</p>}

            <div className="d-flex justify-content-center my-3">
                <button className="btn btn-primary mx-2" onClick={mostrarEventosProximos}>Próximos</button>
                <button className="btn btn-primary mx-2" onClick={mostrarEventosEsteMes}>Este mes</button>
                <button className="btn btn-primary mx-2" onClick={mostrarEventosEstaSemana}>Esta semana</button>
            </div>

            <div className="container mt-4">
                <div className="row">
                    {reservas.map((reserva) => (
                        <div className="col-md-6 mb-3" key={reserva.id}>
                            <div className="card h-100">
                                <div className="row no-gutters">
                                    <div className="col-md-4">
                                        <img src={obtenerImagenAleatoria()} className="card-img" alt="evento social" />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{reserva.titulo}</h5>
                                            <p className="card-text">Fecha: {reserva.fecha.split(" ")[0]}</p>
                                            <p className="card-text">Franja Horaria: {reserva.franjaHoraria}</p>
                                            <p className="card-text">Cantidad de Personas: {reserva.cantidadPersonas}</p>
                                            <p className="card-text">Nombre del salon: {reserva.nombreSalon}</p>
                                            {reserva.horaExtra && <p className="card-text text-muted">Incluye hora extra</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}