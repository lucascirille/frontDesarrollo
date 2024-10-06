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



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
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


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
