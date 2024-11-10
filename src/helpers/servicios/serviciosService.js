import axios from "axios";

// GET
export async function getServicios() {
    try {
        const response = await axios.get("https://localhost:7164/api/Servicio/obtenerServicios");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createServicio(nuevoServicio) {
    try {
        const response = await axios.post("https://localhost:7164/api/Servicio/crearServicio", nuevoServicio);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteServicio(servicioId) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/Servicio/eliminarServicio?id=${servicioId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateServicio(servicioId, servicioData) {
    try {
        const response = await axios.put(`https://localhost:7164/api/Servicio/modificarServicio?id=${servicioId}`, servicioData);
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};