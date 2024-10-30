import { Link } from "react-router-dom";
import '../../styles/layout.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mx-auto d-flex flex-row"> 
              <li className="nav-item">
                <img src="/images/ms-icon-144x144.png" alt="EventCraft" style={{ height: '40px' }} />
                <span style={{ marginLeft: '8px', fontSize: '24px', fontWeight: 'bold' }}>EventCraft</span>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/perfil"}>Perfil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/nosotros"}>Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/salonesCliente"}>Salones</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/eventosSociales"}>Eventos Sociales</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/eventosCorporativos"}>Eventos Corporativos</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  );
}
