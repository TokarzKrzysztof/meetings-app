// const ProtectedRoute = ({ element }: { element: ReactNode }) => {
//   const [isLogged] = useState(false);
//   return <>{isLogged ? element : <Navigate to={'/login'} />}</>;
// };

import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import { AppRoutes } from './utils/enums/app-routes';

export const router = createBrowserRouter([
  {
    path: AppRoutes.Home,
    element: <App />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { Home } = await import('./pages/Home/Home');
          return { Component: Home };
        },
      },
      {
        path: AppRoutes.Login,
        lazy: async () => {
          const { Login } = await import('./pages/Login/Login');
          return { Component: Login };
        },
      },
      {
        path: AppRoutes.Register,
        lazy: async () => {
          const { Register } = await import('./pages/Register/Register');
          return { Component: Register };
        },
      },
      {
        path: AppRoutes.RemindPassword,
        lazy: async () => {
          const { RemindPassword } = await import('./pages/RemindPassword/RemindPassword');
          return { Component: RemindPassword };
        },
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home} /> },
]);
