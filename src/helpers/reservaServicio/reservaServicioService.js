import axios from "axios";

// POST
export async function createReservaServicio(nuevoReservaServicio) {
    try {
        console.log("Estoy en reservaServicio", nuevoReservaServicio);
        const response = await axios.post("https://localhost:7164/api/ReservaServicio/crearReservaServicio", nuevoReservaServicio);
        console.log("Esta es la respuesta", response);
        return response;
    }  catch (error) {
        console.error("Error en la creación de la reserva:", error);
        throw new Error(error.response?.data?.mensaje || "Error desconocido");
    }
};