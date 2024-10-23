import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; 

export default function LayoutCliente({ children }) {

  const [navbarClass, setNavbarClass] = useState("navbar transparent");
  const { user } = useContext(AuthContext); 


  const handleScroll = () => {
    if (window.scrollY > 50) {
      setNavbarClass("navbar solid");
    } else {
      setNavbarClass("navbar transparent");
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
      <nav className={navbarClass + " navbar-expand-lg fixed-top"}>
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/"}>
            <img src="/images/ms-icon-144x144.png" alt="EventCraft" style={{ height: '40px' }} />
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
                <Link className="nav-link" to={"/perfil"}>Perfil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/nosotros"}>Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/salonesCliente"}>Salones</Link>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Eventos
                </a>
                <ul class="dropdown-menu">
                  <li><Link class="dropdown-item" to={"/eventosSociales"}>Sociales</Link></li>
                  <li><Link class="dropdown-item" to={"/eventosCorporativos"}>Corporativos</Link></li>
                </ul>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to={"/reserva"}>Reserva</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link border border-primary rounded btn btn-outline-primary" to={"/contactanos"}>Contactanos</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link border border-primary rounded btn btn-outline-primary" to={"/logout"}>Cerrar Sesión</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link border border-primary rounded btn btn-outline-primary" to={"/login"}>Iniciar Sesión</Link>
                </li>
              )}
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