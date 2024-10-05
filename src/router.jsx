import { createBrowserRouter } from "react-router-dom";
import Perfil from "./routes/perfil";
import Root from "./routes/root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/perfil/:Id",
        element: <Perfil />,
      }
    ]
  },
  {
    path: "/contactanos",
    element: <p>Contactameee</p>
  },
  {
    path: "/nosotros",
    element: <p>Hola</p>
  },
  {
    path: "/reserva",
    element: <p>Reserva</p>
  },
  {
    path: "/eventos",
    element: <p>Eventos</p>
  }
]);

