import '../styles/salonesCliente.css';
import { useState, useEffect } from "react";
import { getSalones } from "../helpers/salones/salonesService";
import { useNavigate } from 'react-router-dom';

export default function SalonesCliente() {

    const [salones, setSalones] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    const handleMoreInfo = (salon) => {
        navigate(`/salon/${salon.id}`, { state: { salon } });
    };

    const salonesActivos = salones.filter(salon => salon.estado === true);

    return(
        <>
            <div id='salonesCliente' className="salones-container">
                <header >
                    <h1>Salones</h1>
                    {salonesActivos.length === 0 && (
                        <span className="no-salones-msg"> - No hay salones disponibles</span>
                    )}
                </header>
            </div>
            <div className="row">
                {
                    salonesActivos.map((salon) => (
                        <div key={salon.id} className="col-md-4 mb-4">
                            <div className="card shadow" style={{ width: "100%" }}>
                                <img src={salon.urlImagen} className="card-img-top" alt={`Image for ${salon.nombre}`} />
                                <div className="card-body">
                                    <h5 className="card-title">{salon.nombre}</h5>
                                    <a className="btn btn-primary" onClick={() => handleMoreInfo(salon)}>Más Información</a>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}