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
import Salones from './routes/salones';
import SalonesCliente from './routes/salonesCliente';
import SalonInfo from './routes/components/salonInfo';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './routes/components/login';
import LogoutForm from './routes/components/logout';
import RegisterForm from './routes/components/register';
import ProtectedRoute from './routes/components/utils/protectedRoute';



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
        path: "/perfil",
        element: <Perfiles />,
        children: [
          {
            path: ":Id",
            element: <Perfil />,
          }
        ]

      },
      {
        path: "/nosotros",
        element: <p> nosotrosss</p>
      },
      {
        path: "/salones",
        element:<ProtectedRoute allowedRoles={['Admin']}> <Salones /> </ProtectedRoute>
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
      },
      {
        path: "/login",
        element: <LoginForm />
      },
      {
        path: "/logout",
        element: <LogoutForm />
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
