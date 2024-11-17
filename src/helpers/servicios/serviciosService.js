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
export async function createServicio(nuevoServicio, auth) {
    try {
        const response = await axios.post("https://localhost:7164/api/Servicio/crearServicio", nuevoServicio, {
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
export async function deleteServicio(servicioId, auth) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/Servicio/eliminarServicio?id=${servicioId}`, {
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
export async function updateServicio(servicioId, servicioData, auth) {
    try {
        const response = await axios.put(`https://localhost:7164/api/Servicio/modificarServicio?id=${servicioId}`, servicioData, {
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