import '../styles/salonesCliente.css';
import { useState, useEffect } from "react";
import { getSalones } from "../helpers/salones/salonesService";

export default function SalonesCliente() {

    const [salones, setSalones] = useState([]);
    const [error, setError] = useState(null);

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


    return(
        <>
            <div id='salonesCliente' className="salones-container">
                <header >
                    <h1>Salones</h1>
                </header>
            </div>
            <div className="row">
                {salones.map((salon) => (
                    <div key={salon.id} className="col-md-4 mb-4">
                        <div className="card shadow" style={{ width: "100%" }}>
                            <img src="/images/hotel-exterior-night.jpg" className="card-img-top" alt={`Image for ${salon.nombre}`} />
                            <div className="card-body">
                                <h5 className="card-title">{salon.nombre}</h5>
                                <p className="card-text">Tipo: {salon.tipo}</p>
                                <p className="card-text">Telefono: {salon.telefono}</p>
                                <p className="card-text">Capacidad: {salon.capacidad}</p>
                                <p className="card-text">Dimensiones MT2: {salon.dimensionesMt2}</p>
                                <p className="card-text">Precio Base: {salon.precioBase}</p>
                                <p className="card-text">Precio Hora: {salon.precioHora}</p>
                                <p className="card-text">Direccion: {salon.direccion}</p>
                                <p className="card-text">Localidad: {salon.localidad}</p>
                                <a href="#" className="btn btn-primary">Reserva capo</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}