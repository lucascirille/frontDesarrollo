import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { getSalones,createSalon,deleteSalon,updateSalon } from "../helpers/salones/salonesService";
import ConfirmarEliminacion from "./components/confirmarEliminacion";

const schema = yup.object({
    nombre: yup.string().required(),
    tipo: yup.string().required(),
    estado: yup.boolean().required(),
    telefono: yup.string()
    .required()
    .matches(/^\+?[0-9\s-]{10,15}$/),
    capacidad: yup.number().positive().integer().required(),
    dimensionesMt2: yup.number().positive().required(),
    precioBase: yup.number().positive().required(),
    precioHora: yup.number().positive().required(),
    direccion: yup.string().required(),
    localidad: yup.string().required(),
  }).required();

export default function Salones() {
    
    const [salones, setSalones] = useState([]);
    const [salonAEliminar, setSalonAEliminar] = useState(null);
    const [salonAEditar, setSalonAEditar] = useState(null);
    const [error, setError] = useState(null);
    const [showSalones, setShowSalones] = useState(true);
    const [formVisible, setFormVisible] = useState(false);
    const { register, handleSubmit, reset, setValue } = useForm({
        resolver: yupResolver(schema)
      }); 

    useEffect(() => {
        async function ObtenerSalones() {
            try {
                const response = await getSalones();
                setSalones(response.data.datos);
                console.log(response.data.datos);
            } catch (error) {
                console.error("Error al obtener los salones:", error);
                setError("Error al obtener los datos.");
            }
        }
        ObtenerSalones(); 
    }, []);

    const onSubmit = async (data) => {
        try {
            if (salonAEditar) {
                await updateSalon(salonAEditar.id, data);
                setSalones(salones.map(salon => salon.id === salonAEditar.id ? data : salon));
                setSalonAEditar(null);  
            } else {
                const response = await createSalon(data);
                setSalones([...salones, response.data.datos]);
            }
            reset();
            setFormVisible(false);  
        } catch (error) {
            setError(salonAEditar ? "Error al actualizar el salón." : "Error al crear el salón.");
        }
    };


    const handleDeleteSalon = (salonId) => {
        setSalonAEliminar(salonId);
        setShowSalones(false);
    };

    const handleEditSalon = (salon) => {
        setSalonAEditar(salon);
        setFormVisible(true);

        Object.keys(salon).forEach((key) => {
            setValue(key, salon[key]);
        });
    };



    const confirmarDeleteSalon = async () => {
            try {
                console.log(salonAEliminar);
                await deleteSalon(salonAEliminar);
                setSalones(salones.filter(salon => salon.id !== salonAEliminar));
                setSalonAEliminar(null); 
                setShowSalones(true);
            } catch (error) {
                console.error("Error al eliminar el salón:", error);
                setError("Error al eliminar el salón.");
            }
    };

    const cancelarDeleteSalon = () => {
        setSalonAEliminar(null); 
        setShowSalones(true);
    };

    return (
        <>

            <button type="button" className="btn btn-success" onClick={() => setFormVisible(true)}>
                Crear Salón
            </button>

            {formVisible && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        placeholder="Nombre del salón"
                        {...register("nombre")} 
                    />
                    <br />
                    <input
                        placeholder="tipo del salón"
                        {...register("tipo")} 
                    />
                    <br />
                    <label>
                        ¿Publicar?
                        <input
                            type="checkbox"
                            {...register("estado")} 
                        />
                    </label>
                    <br />
                    <input
                        type="tel"
                        placeholder="Telefono"
                        {...register("telefono")}
                    />
                    <br />
                    <input
                        type="number"
                        placeholder="Capacidad del salón"
                        {...register("capacidad")}
                    />
                    <br />
                    <input
                        placeholder="Dimensiones en Mt2"
                        {...register("dimensionesMt2")}
                    />
                    <br />
                    <input
                        placeholder="Precio Base"
                        {...register("precioBase")}
                    />
                    <br />
                    <input
                        placeholder="Precio Hora"
                        {...register("precioHora")}
                    />
                    <br />
                    <input
                        placeholder="Direccion"
                        {...register("direccion")}
                    />
                    <br />
                    <input
                        placeholder="Localidad"
                        {...register("localidad")}
                    />
                    <br />
                    <button type="submit">Guardar Salón</button>
                    <button type="button" onClick={() => setFormVisible(false)}>Cancelar</button>
                </form>
            )}

            {showSalones && !formVisible && salones && (
                <div>
                    {salones
                    //.filter(salon => salon.estado === true)
                    .map((salon) => (
                        <div key={salon.id}>
                            <hr />
                            <h3>{salon.nombre}</h3>
                            <ul>
                                <li>Tipo: {salon.tipo}</li>
                                <li>Estado: {salon.estado ? "Activo" : "Inactivo"}</li>
                                <li>Teléfono: {salon.telefono}</li>
                                <li>Capacidad: {salon.capacidad}</li>
                                <li>Dimensiones (m²): {salon.dimensionesMt2}</li>
                                <li>Precio Base: {salon.precioBase}</li>
                                <li>Precio por Hora: {salon.precioHora}</li>
                                <li>Dirección: {salon.direccion}</li>
                                <li>Localidad: {salon.localidad}</li>
                            </ul>
                            <button onClick={() => handleDeleteSalon(salon.id)}>Eliminar</button>
                            <button onClick={() => handleEditSalon(salon)}>Editar</button>
                        </div>
                    ))}
                </div>
            )}

            {salonAEliminar && (
                <ConfirmarEliminacion
                    onConfirm={confirmarDeleteSalon}
                    onCancel={cancelarDeleteSalon}
                />
            )}
            
        </>

    );
}