import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar el CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importar el JS de Bootstrap
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import Perfil from './routes/perfil';
import Perfiles from "./routes/perfiles"
import ErrorPage from './routes/errorPage';
import Home from './routes/home';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/perfil",
        element: <Perfiles />,
        children: [
          {
            path: "/perfil/:Id",
            element: <Perfil />,
          }
        ]

      },
      {
        path: "/nosotros",
        element: <p>Hola a todos</p>
      },
      {
        path: "/salones",
        element: <p>Salones</p>
      },
      {
        path: "/eventosSociales",
        element: <p>Eventos Sociales</p>
      },
      {
        path: "/eventosCorporativos",
        element: <p>Eventos Corporativos</p>
      },
      {
        path: "/reserva",
        element: <p>Reserva</p>
      },
      {
        path: "/contactanos",
        element: <p>Contactameee</p>
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
