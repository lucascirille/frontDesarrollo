import axios from "axios";

// GET
export async function getUsuarios() {
    try {
        const response = await axios.get("https://localhost:7164/api/Usuario/obtenerUsuariosSinPass");
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}

// POST
export async function createUsuario(nuevoUsuario) {
    try {
        const response = await axios.post("https://localhost:7164/api/Usuario/crearUsuario", nuevoUsuario);
        return response;
    } catch (error) {
        console.log("Este es el error: ", error.response.data.mensaje)
        throw new Error(error.response.data.mensaje);
    }
};

//DELETE
export async function deleteUsuario(usuarioId) {
    try {
        const response = await axios.delete(`https://localhost:7164/api/Usuario/eliminarUsuario?id=${usuarioId}`);
        return response;
    } catch (error) {
        throw new Error(error.response.data.mensaje);
    }
}

//EDIT
export async function updateUsuario(usuarioId, usuarioData) {
    try {
        const response = await axios.put(`https://localhost:7164/api/Usuario/modificarUsuario?id=${usuarioId}`, usuarioData);
        return response;
    } catch (error) {
        console.log("Error en el service", error.response);
        throw new Error(error.response.data.mensaje);
    } 
};