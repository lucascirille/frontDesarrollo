import axios from "axios";

// GET
export function getSalones() {
    return axios.get("https://localhost:7164/api/Salon/obtenerSalones");
}

// POST
export function createSalon(nuevoSalon) {
    return axios.post("https://localhost:7164/api/Salon/crearSalon", nuevoSalon); 
};

//DELETE
export function deleteSalon(salonId) {
    return axios.delete(`https://localhost:7164/api/Salon/eliminarSalon?id=${salonId}`);
}

export const updateSalon = (salonId, salonData) => {
    return axios.put(`https://localhost:7164/api/Salon/modificarSalon?id=${salonId}`, salonData);
};

// GET
export function getCaracteristicasBySalonId(salonId) {
    return axios.get(`https://localhost:7164/api/SalonCaracteristica/obtenerCaracteristicaPorSalonId?id=${salonId}`);
}

// GET
export function getServiciosBySalonId(salonId) {
    return axios.get(`https://localhost:7164/api/SalonServicio/obtenerServicioPorSalonId?id=${salonId}`);
}

