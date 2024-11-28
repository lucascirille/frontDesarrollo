//import axios from "axios";

// GET
/*export async function getTrabajadoresByProfesion(profesion, fecha) {
    try {
        const response = await axios.get("api/Trabajadores/obtenerTrabajadores", profesion, fecha);
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}*/

export const getTrabajadoresByProfesion = (profesion) => {
    return new Promise((resolve) => {
        setTimeout(() => {

            // Datos simulados
            const trabajadoresMock = [
                // Maquillaje
                { nombre: "Juan", apellido: "Pérez", email: "juan.perez@mail.com", estrellas: 4.5, profesion: "Maquillaje" },
                { nombre: "Leo", apellido: "Nuñez", email: "leo.nuñez@mail.com", estrellas: 4.8, profesion: "Maquillaje" },
                { nombre: "María", apellido: "Fernández", email: "maria.fernandez@mail.com", estrellas: 4.7, profesion: "Maquillaje" },
                { nombre: "Laura", apellido: "Martínez", email: "laura.martinez@mail.com", estrellas: 5, profesion: "Maquillaje" },
            
                // Payaso
                { nombre: "Ana", apellido: "García", email: "ana.garcia@mail.com", estrellas: 5, profesion: "Payaso" },
                { nombre: "Roberto", apellido: "Hernández", email: "roberto.hernandez@mail.com", estrellas: 4.3, profesion: "Payaso" },
                { nombre: "Carmen", apellido: "López", email: "carmen.lopez@mail.com", estrellas: 4.9, profesion: "Payaso" },
                { nombre: "Jorge", apellido: "Ramírez", email: "jorge.ramirez@mail.com", estrellas: 4.6, profesion: "Payaso" },
            
                // Mago
                { nombre: "Carlos", apellido: "López", email: "carlos.lopez@mail.com", estrellas: 4.2, profesion: "Mago" },
                { nombre: "Luis", apellido: "Pineda", email: "luis.pineda@mail.com", estrellas: 4.8, profesion: "Mago" },
                { nombre: "Valeria", apellido: "Sánchez", email: "valeria.sanchez@mail.com", estrellas: 4.7, profesion: "Mago" },
                { nombre: "Esteban", apellido: "Castro", email: "esteban.castro@mail.com", estrellas: 5, profesion: "Mago" },

                // Barman
                { nombre: "David", apellido: "Martínez", email: "david.martinez@mail.com", estrellas: 4.6, profesion: "Barman" },
                { nombre: "Jessica", apellido: "Gómez", email: "jessica.gomez@mail.com", estrellas: 4.4, profesion: "Barman" },
                { nombre: "Pedro", apellido: "Vázquez", email: "pedro.vazquez@mail.com", estrellas: 4.8, profesion: "Barman" },
                { nombre: "Sofía", apellido: "Reyes", email: "sofia.reyes@mail.com", estrellas: 4.7, profesion: "Barman" },

                // Fotógrafo
                { nombre: "Alfredo", apellido: "Serrano", email: "alfredo.serrano@mail.com", estrellas: 5, profesion: "Fotógrafo" },
                { nombre: "Gabriela", apellido: "Pérez", email: "gabriela.perez@mail.com", estrellas: 4.9, profesion: "Fotógrafo" },
                { nombre: "Andrés", apellido: "Ruiz", email: "andres.ruiz@mail.com", estrellas: 4.6, profesion: "Fotógrafo" },
                { nombre: "Clara", apellido: "López", email: "clara.lopez@mail.com", estrellas: 4.8, profesion: "Fotógrafo" },

                // Animador
                { nombre: "Ricardo", apellido: "González", email: "ricardo.gonzalez@mail.com", estrellas: 4.7, profesion: "Animador" },
                { nombre: "Marta", apellido: "Jiménez", email: "marta.jimenez@mail.com", estrellas: 5, profesion: "Animador" },
                { nombre: "Luis", apellido: "Rodríguez", email: "luis.rodriguez@mail.com", estrellas: 4.5, profesion: "Animador" },
                { nombre: "Silvia", apellido: "Morales", email: "silvia.morales@mail.com", estrellas: 4.6, profesion: "Animador" },

                // Limpieza
                { nombre: "Carlos", apellido: "Vega", email: "carlos.vega@mail.com", estrellas: 4.3, profesion: "Limpieza" },
                { nombre: "Raquel", apellido: "Sánchez", email: "raquel.sanchez@mail.com", estrellas: 4.8, profesion: "Limpieza" },
                { nombre: "Fernando", apellido: "Hernández", email: "fernando.hernandez@mail.com", estrellas: 4.4, profesion: "Limpieza" },
                { nombre: "Verónica", apellido: "Torres", email: "veronica.torres@mail.com", estrellas: 4.6, profesion: "Limpieza" },

                // Seguridad
                { nombre: "José", apellido: "Mendoza", email: "jose.mendoza@mail.com", estrellas: 4.5, profesion: "Seguridad" },
                { nombre: "Antonio", apellido: "Gómez", email: "antonio.gomez@mail.com", estrellas: 4.7, profesion: "Seguridad" },
                { nombre: "Beatriz", apellido: "López", email: "beatriz.lopez@mail.com", estrellas: 4.8, profesion: "Seguridad" },
                { nombre: "Luis", apellido: "Jiménez", email: "luis.jimenez@mail.com", estrellas: 4.6, profesion: "Seguridad" }
            ];
            

            // Filtrar los trabajadores por la profesión solicitada
            const trabajadoresFiltrados = trabajadoresMock.filter(t => t.profesion === profesion);

            // Convertir a JSON antes de resolver
            resolve(JSON.stringify(trabajadoresFiltrados));
        }, 1000); // Simula un retraso de 1 segundo
    });
};