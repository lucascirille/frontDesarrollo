import axios from "axios";

// GET
export async function getReservas() {
    try {
        const response = await axios.get("https://localhost:7164/api/Reserva/obtenerReservas");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

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

//DELETE
export async function deleteReserva(reservaId) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/Reserva/eliminarReserva?id=${reservaId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateReserva(reservaId, reservaData) {
    try {
        const response = await axios.put(`https://localhost:7164/api/Reserva/modificarReserva?id=${reservaId}`, reservaData);
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};


// GET
export async function getFechasOcupadas(salonId, franjaHoraria) {
    try {
        const response = await axios.get(`https://localhost:7164/api/Reserva/fechasOcupadas`, {
            params: {
                salonId,
                franjaHoraria
            }
        });
        return response;
    } catch (error) {
        if (error.response?.status === 400) {
            console.warn("No se encontraron reservas para el salón y franja horaria especificados.");
            return [];
        }
        console.error("Error al obtener las fechas ocupadas:", error);
        throw new Error(error.response?.data?.mensaje || "Error desconocido al obtener fechas ocupadas");
    }
} 

//GET
export async function GetReservasDeSalonesSociales() {
    try {
        const response = await axios.get("https://localhost:7164/api/Reserva/obtenerReservasDeSalonesSociales");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response?.data?.mensaje);
    }
}

//GET
export async function GetReservasDeSalonesCorporativos() {
    try {
        const response = await axios.get("https://localhost:7164/api/Reserva/obtenerReservasDeSalonesCorporativos");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response?.data?.mensaje);
    }
}

//GET
export async function GetReservaIdByReservaNombre(nombreReserva) {
    try {
        const encodedNombreReserva = encodeURIComponent(nombreReserva);
        const response = await axios.get(`https://localhost:7164/api/Reserva/obtenerReservaId?nombreReserva=${encodedNombreReserva}`);
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response?.data?.mensaje);
    }
}