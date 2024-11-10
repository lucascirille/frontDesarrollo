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
export async function createSalonServicio(nuevoSalonServicio) {
    try {
        const response = await axios.post("https://localhost:7164/api/SalonServicio/crearSalonServicio", nuevoSalonServicio);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteSalonServicio(SalonServicioId) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/SalonServicio/eliminarSalonServicio?id=${SalonServicioId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateSalonServicio(SalonServicioId, SalonServicioData) {
    try {
        const response = await axios.put(`https://localhost:7164/api/SalonServicio/modificarSalonServicio?id=${SalonServicioId}`, SalonServicioData);
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};