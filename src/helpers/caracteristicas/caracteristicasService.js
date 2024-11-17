import axios from "axios";

// GET
export async function getCaracteristicas() {
    try {
        const response = await axios.get("https://localhost:7164/api/Caracteristica/obtenerCaracteristicas");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createCaracteristica(nuevaCaracteristica, auth) {
    try {
        //console.log("estoy en crear caracteristica", nuevaCaracteristica);
        const response = await axios.post("https://localhost:7164/api/Caracteristica/crearCaracteristica", nuevaCaracteristica, {
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
export async function deleteCaracteristica(caracteristicaId, auth) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/Caracteristica/eliminarCaracteristica?id=${caracteristicaId}`, {
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
export async function updateCaracteristica(caracteristicaId, caracteristicaData, auth) {
    try {
        const response = await axios.put(`https://localhost:7164/api/Caracteristica/modificarCaracteristica?id=${caracteristicaId}`, caracteristicaData, {
            headers: {
                Authorization: `Bearer ${auth}`
            }
        });
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    } 
};