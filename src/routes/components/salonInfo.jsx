import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCaracteristicasBySalonId, getServiciosBySalonId } from '../../helpers/salones/salonesService';
import "../../styles/salonInfo.css"
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function SalonInfo() {
    const { id } = useParams();
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function ObtenerCaracteristicas(id) {
            try {
                const response = await getCaracteristicasBySalonId(id);
                if (response.data && response.data.datos.length > 0) { 
                    console.log(response.data.datos);
                    setCaracteristicas(response.data.datos);
                } else {
                    console.log("No hay características disponibles para este salón.");
                }
            } catch (error) {
                console.error("Error al obtener los salones:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerCaracteristicas(id); 
    }, [id]);
    
    useEffect(() => {
        async function ObtenerServicios(id) {
            try {
                const response = await getServiciosBySalonId(id);
                if (response.data && response.data.datos.length > 0) { 
                    console.log(response.data.datos);
                    setServicios(response.data.datos);
                } else {
                    console.log("No hay servicios disponibles para este salón.");
                }
            } catch (error) {
                console.error("Error al obtener los salones:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerServicios(id); 
    }, [id]);


    return (
        <>
            {caracteristicas.length > 0 ? (
                <div className="row">
                    <h3>Características</h3>
                    {caracteristicas.map((caracteristica, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card carac shadow-sm p-3 text-center" id='caracteristica'>
                                <img
                                    src={"/images/donut.png"} 
                                    style={{ width: '50px', height: '50px' }} 
                                />
                                <h5 className="mt-2">{caracteristica.nombre}</h5>
                                <p>{caracteristica.descripcion}</p> 
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay características disponibles.</p>
            )}

            <hr style={{ margin: '20px 0', border: '1px solid #ccc', borderTop: '3px solid red' }} />

            {servicios.length > 0 ? (
                <div className="row">
                    <h3>Servicios</h3>
                    {servicios.map((servicio, index) => (
                        <div key={index} className="col-md-4 mb-3">
                            <div className="card border-success shadow-lg p-4 text-start"> 
                                <i className="fas fa-gamepad"></i> 
                                <h5 className="mt-2">{servicio.servicio.nombre}</h5>
                                <p className="small">{servicio.servicio.descripcion}</p> 
                                <p className="small">Precio: {servicio.precio}</p> 
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No hay servicios disponibles.</p>
            )}

            <Link to={"/salonesCliente"} ><button>Volver</button></Link>
        </>
    );
}