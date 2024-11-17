import axios from "axios";

// GET
export async function getSalonCaracteristicas() {
    try {
        const response = await axios.get("https://localhost:7164/api/SalonCaracteristica/obtenerSalonesCaracteristicas");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createSalonCaracteristica(nuevoSalonCaracteristica, auth) {
    try {
        const response = await axios.post("https://localhost:7164/api/SalonCaracteristica/crearSalonCaracteristica", nuevoSalonCaracteristica, {
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
export async function deleteSalonCaracteristica(SalonCaracteristicaId, auth) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/SalonCaracteristica/eliminarSalonCaracteristica?id=${SalonCaracteristicaId}`, {
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
export async function updateSalonCaracteristica(SalonCaracteristicaId, SalonCaracteristicaData, auth) {
    try {
        const response = await axios.put(`https://localhost:7164/api/SalonCaracteristica/modificarSalonCaracteristica?id=${SalonCaracteristicaId}`, SalonCaracteristicaData, {
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