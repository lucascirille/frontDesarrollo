//el contexto de autenticacion se encargue de almacenar y gestionar la información del usuario logueado, 
//incluyendo su rol.
import React, { createContext, useState, useEffect } from 'react';
import { obtenerRol, login, logout } from '../helpers/usuarios/loginRegisterLogout';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [userId, setUserId] = useState(null); 
    const [role, setRole] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const verificarAutenticacion = async () => {
            const storedUser = localStorage.getItem("user");
            const storedRole = localStorage.getItem("userRole");
            const storedId = localStorage.getItem("userId");


            if (storedUser) {
                setUser(JSON.parse(storedUser)); 
            }

            if (storedRole) {
                setRole(storedRole); 
            }

            if (storedId) {
                setUserId(parseInt(storedId));
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
            console.log("estoy en inicio de sesion", userInfo);

            localStorage.setItem("user", JSON.stringify(userInfo.userData));
            localStorage.setItem("userId", userInfo.userData.id);
            localStorage.setItem("userRole", userInfo.userData.rol);

            setUser(userInfo.userData); 
            setUserId(parseInt(userInfo.userData.id));
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
            setUserId(null);
            setRole(null); 
            localStorage.removeItem("userRole");
            localStorage.removeItem("userId");
            localStorage.removeItem("user");
        } catch (error) {
            console.error('Error en el logout:', error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userId, role, loading, iniciarSesion, cerrarSesion, error }}>
            {children}
        </AuthContext.Provider>
    );
};


