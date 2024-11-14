import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';  // Importar el CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Importar el JS de Bootstrap
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/root';
import ErrorPage from './routes/errorPage';
import Home from './routes/home';
import Salones from './routes/salones';
import SalonesCliente from './routes/salonesCliente';
import SalonInfo from './routes/components/salonInfo';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './routes/components/login';
import LogoutForm from './routes/components/logout';
import RegisterForm from './routes/components/register';
import ProtectedRoute from './routes/components/utils/protectedRoute';
import Nosotros from './routes/nosotros';
import Sociales from './routes/sociales';
import Coorporativos from './routes/coorporativos';
import Reserva from './routes/reserva';
import ReservaServicios from './routes/components/reservaServicios';
import Caracteristicas from './routes/caracteristicas';
import Servicios from './routes/servicios';
import SalonCaracteristicas from './routes/salonCaracteristicas';
import SalonServicios from './routes/salonServicios';
import ReservaAdmin from './routes/reservaAdmin';
import ReservaServiciosAdmin from './routes/reservaServiciosAdmin';
import Usuarios from './routes/usuarios';



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Esto indica que este es el componente a mostrar en la ruta raíz
        element: <Home />,
      },
      {
        path: "/nosotros",
        element: <Nosotros/>
      },
      {
        path: "/salones",
        element:<ProtectedRoute allowedRoles={['Admin']}> <Salones /> </ProtectedRoute>
      },
      {
        path: "/caracteristicas",
        element:<ProtectedRoute allowedRoles={['Admin']}> <Caracteristicas /> </ProtectedRoute>
      },
      {
        path: "/servicios",
        element:<ProtectedRoute allowedRoles={['Admin']}> <Servicios /> </ProtectedRoute>
      },
      {
        path: "/salonCaracteristicas",
        element:<ProtectedRoute allowedRoles={['Admin']}> <SalonCaracteristicas /> </ProtectedRoute>
      },
      {
        path: "/salonServicios",
        element:<ProtectedRoute allowedRoles={['Admin']}> <SalonServicios /> </ProtectedRoute>
      },
      {
        path: "/reservaAdmin",
        element:<ProtectedRoute allowedRoles={['Admin']}> <ReservaAdmin /> </ProtectedRoute>
      },
      {
        path: "/reservaServiciosAdmin",
        element:<ProtectedRoute allowedRoles={['Admin']}> <ReservaServiciosAdmin /> </ProtectedRoute>
      },
      {
        path: "/usuarios",
        element:<ProtectedRoute allowedRoles={['Admin']}> <Usuarios /> </ProtectedRoute>
      },
      {
        path: "/salonesCliente",
        element: <SalonesCliente />
      },
      {
        path: "/salon/:id",
         element: <SalonInfo />
      },
      {
        path: "/eventosSociales",
        element: <Sociales />
      },
      {
        path: "/eventosCorporativos",
        element: <Coorporativos />
      },
      {
        path: "/reserva",
        element: <ProtectedRoute allowedRoles={['Admin', 'Cliente']}> <Reserva /></ProtectedRoute>
      },
      {
        path: "/reservaServicios",
        element: <ProtectedRoute allowedRoles={['Admin', 'Cliente']}><ReservaServicios /></ProtectedRoute> 
      },
      {
        path: "/contactanos",
        element: <p>Contactameee</p>
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/logout",
        element:<ProtectedRoute allowedRoles={['Admin', 'Cliente']}> <LogoutForm /></ProtectedRoute>
      },
      {
        path: "/register",
        element: <RegisterForm />
      }
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
  
);
