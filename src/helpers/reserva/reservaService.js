import axios from "axios";

// POST
export async function createReserva(nuevaReserva) {
    try {
        console.log("Estoy en reserva", nuevaReserva);
        const response = await axios.post("https://localhost:7164/api/Reserva/crearReserva", nuevaReserva);
        console.log("Esta es la respuesta", response);
        return response;
    }  catch (error) {
        console.error("Error en la creación de la reserva:", error);
        throw new Error(error.response?.data?.mensaje || "Error desconocido");
    }
};