//import axios from "axios";

// GET
/*export async function getDescuento(cupon) {
    try {
        const response = await axios.get("api/Cupones/obtenerDescuentos", cupon);
        return response;
    } catch (error) {
        console.log(error.response);
        throw new Error(error.response.data.mensaje);
    }
}*/

export const getDescuento = (codigoCupon) => {
    
    const cuponesBaseDeDatos = [
        { codigo: "DESC10", descuento: 10, vencimiento: "2024-12-31", utilizado: false }, // Válido
        { codigo: "DESC20", descuento: 20, vencimiento: "2024-11-30", utilizado: false }, // Válido
        { codigo: "DESC15", descuento: 15, vencimiento: "2024-10-15", utilizado: false }, // Vencido
        { codigo: "DESC05", descuento: 5, vencimiento: "2023-11-30", utilizado: false },  // Vencido
        { codigo: "DESC50", descuento: 50, vencimiento: "2024-12-31", utilizado: true },  // Utilizado
        { codigo: "DESC30", descuento: 30, vencimiento: "2024-12-07", utilizado: false }, // Válido
        { codigo: "BLACKFRIDAY", descuento: 40, vencimiento: "2024-11-28", utilizado: true }, // Utilizado
        { codigo: "CYBERMONDAY", descuento: 25, vencimiento: "2024-12-03", utilizado: false }, // Válido
        { codigo: "EXPIRED", descuento: 10, vencimiento: "2023-09-30", utilizado: false },   // Vencido
      ];
      
  
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cupon = cuponesBaseDeDatos.find(c => c.codigo === codigoCupon);
        if (cupon) {
            resolve(JSON.stringify(cupon));
        } else {
            reject(JSON.stringify({ error: "El cupón ingresado no existe." }));
        }
      }, 1000); 
    });
  };
  