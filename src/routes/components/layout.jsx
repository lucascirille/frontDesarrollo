import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 
import '../../styles/layout.css'

export default function Layout({ children }) {

    const [navbarClass, setNavbarClass] = useState("navbar-transparent");
    const { user } = useContext(AuthContext); 
  
  
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarClass("navbar-solid");
      } else {
        setNavbarClass("navbar-transparent");
      }
    };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (

    <>
      <nav className={`${navbarClass} navbar navbar-expand-lg fixed-top`}>
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/"}>
            <img src="/images/alconMilenial.png" alt="EventCraft" style={{ height: '40px' }} />
            <span style={{ marginLeft: '8px', fontSize: '24px', fontWeight: 'bold' }}>EventCraft</span>
          </Link>
          {user && (
            <span className="navbar-text ms-3">
              Bienvenido, {user.nombreUsuario}
            </span>
          )}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/salones"}>Salones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/caracteristicas"}>Caracteristicas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/servicios"}>Servicios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/salonCaracteristicas"}>Salon-Caracteristicas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/salonServicios"}>Salon-Servicios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/reservaAdmin"}>Reservas</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/reservaServiciosAdmin"}>Reserva-Servicios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/usuarios"}>Usuarios</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border border-primary rounded btn btn-outline-primary" to={"/logout"}>Cerrar Sesión</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div style={{  paddingTop: '70px', width: '100%', height: '100vh' }}>
        {children}
      </div>

    </>
  );
}
