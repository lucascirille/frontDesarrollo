import axios from "axios";

// GET
export async function getReservaServicios() { 
    try {
        const response = await axios.get("https://localhost:7164/api/ReservaServicio/obtenerReservasServicios");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createReservaServicio(nuevoReservaServicio, auth) {
    try {
        const response = await axios.post("https://localhost:7164/api/ReservaServicio/crearReservaServicio", nuevoReservaServicio, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    }  catch (error) {
        console.error("Error en la creación de la reserva:", error);
        throw new Error(error.response?.data?.mensaje || "Error desconocido");
    }
};

//DELETE
export async function deleteReservaServicio(reservaServicioId, auth) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/ReservaServicio/eliminarReservaServicio?id=${reservaServicioId}`, {
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
export async function updateReservaServicio(reservaServicioId, reservaServicioData, auth) {
    try {
        const response = await axios.put(`https://localhost:7164/api/ReservaServicio/modificarReservaServicio?id=${reservaServicioId}`, reservaServicioData, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    } catch (error) {
        console.log("Error en la edicion", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};