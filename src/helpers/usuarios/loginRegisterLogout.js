import axios from 'axios';

export const register = async (data) => {
    try {
        const response = await axios.post("https://localhost:7164/api/Usuario/register", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje);
    }
};

export const login = async (data) => {
    try {
        const response = await axios.post("https://localhost:7164/api/Usuario/login", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje);
    }
};

export const logout = async () => {
    try {
        const response = await axios.post("https://localhost:7164/api/Usuario/logout");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje);
    }
};

export const obtenerRol = async () => {
    try {
        const response = await axios.get("https://localhost:7164/api/Usuario/obtenerRol");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje);
    }
};