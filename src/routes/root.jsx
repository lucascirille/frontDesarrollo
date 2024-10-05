// Aca va el Layout de la pagina
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div>
        Hola, soy el layout de la pagina
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
