import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
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
