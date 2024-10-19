//el contexto de autenticacion se encargue de almacenar y gestionar la información del usuario logueado, 
//incluyendo su rol.
import React, { createContext, useState, useEffect } from 'react';
import { obtenerRol, login, logout } from '../helpers/usuarios/loginRegisterLogout';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [role, setRole] = useState(null); 
    const [loading, setLoading] = useState(true); //para el tema de la carga


    useEffect(() => {
        const verificarAutenticacion = async () => {
            try {
                const userRole = await obtenerRol(); // 
                setRole(userRole); 
            } catch (error) {
                console.log('No se pudo obtener el rol del usuario');
            } finally {
                setLoading(false);
            }
        };

        verificarAutenticacion();
    }, []);

    const iniciarSesion = async (userData) => {
        try {
            console.log("estoy en iniciar sesion");
            const userInfo = await login(userData); 
            console.log(userInfo);
            setUser(userInfo); 
            setRole(userInfo.role); 
        } catch (error) {
            console.error('Error en el login:', error);
        }
    };

    const cerrarSesion = async () => {
        try {
            await logout(); 
            setUser(null);
            setRole(null); 
        } catch (error) {
            console.error('Error en el logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};


