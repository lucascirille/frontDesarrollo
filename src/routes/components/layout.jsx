import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (

    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to={"/"}>EventCraft</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to={"/perfil"}>Perfil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/contactanos"}>Contactanos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/nosotros"}>Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/reserva"}>Reserva</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/eventos"}>Eventos</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        {children}
      </div>

    </>
  );
}
