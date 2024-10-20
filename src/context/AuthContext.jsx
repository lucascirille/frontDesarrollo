//el contexto de autenticacion se encargue de almacenar y gestionar la información del usuario logueado, 
//incluyendo su rol.
import React, { createContext, useState, useEffect } from 'react';
import { obtenerRol, login, logout } from '../helpers/usuarios/loginRegisterLogout';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [role, setRole] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const verificarAutenticacion = async () => {
            const storedUser = localStorage.getItem("user");
            const storedRole = localStorage.getItem("userRole");


            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Restablecer usuario en el contexto
            }

            if (storedRole) {
                setRole(storedRole); // Restablece el rol en el contexto
            }
            setLoading(false);
        };

        verificarAutenticacion();
    }, []);

    const iniciarSesion = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const userInfo = await login(userData);

            localStorage.setItem("user", JSON.stringify(userInfo.userData));
            localStorage.setItem("userRole", userInfo.userData.rol);

            setUser(userInfo.userData); 
            setRole(userInfo.userData.rol); 
            return true;
        } catch (error) {
            console.error('Error en el login:', error);
            setError('Usuario o contraseña incorrectos');
            return false;
        }finally {
            setLoading(false);
        }
    };

    const cerrarSesion = async () => {
        setLoading(true);
        try {
            await logout(); 
            setUser(null);
            setRole(null); 
            localStorage.removeItem("userRole");
            localStorage.removeItem("user");
        } catch (error) {
            console.error('Error en el logout:', error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, iniciarSesion, cerrarSesion, error }}>
            {children}
        </AuthContext.Provider>
    );
};


