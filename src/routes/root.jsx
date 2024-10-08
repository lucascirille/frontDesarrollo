import { Outlet, useLocation } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./home";

export default function Root() {

  const location = useLocation();

  return (
    <Layout>
      {location.pathname === "/" && <Home />}  {/* Muestra Home solo en la ruta raíz */}
      <Outlet />
    </Layout>
  );
}
