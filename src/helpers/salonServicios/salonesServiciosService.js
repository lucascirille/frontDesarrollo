import axios from "axios";

// GET
export async function getSalonServicios() { 
    try {
        const response = await axios.get("https://localhost:7164/api/SalonServicio/obtenerSalonesServicios");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createSalonServicio(nuevoSalonServicio, auth) {
    try {
        const response = await axios.post("https://localhost:7164/api/SalonServicio/crearSalonServicio", nuevoSalonServicio, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteSalonServicio(SalonServicioId, auth) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/SalonServicio/eliminarSalonServicio?id=${SalonServicioId}`, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateSalonServicio(SalonServicioId, SalonServicioData, auth) {
    try {
        const response = await axios.put(`https://localhost:7164/api/SalonServicio/modificarSalonServicio?id=${SalonServicioId}`, SalonServicioData, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};