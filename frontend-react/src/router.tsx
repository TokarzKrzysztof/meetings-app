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
        path: AppRoutes.ForgotPassword,
        lazy: async () => {
          const { ForgotPassword } = await import(
            './pages/ForgotPassword/ForgotPassword'
          );
          return { Component: ForgotPassword };
        },
      },
      {
        path: AppRoutes.ResetPassword,
        lazy: async () => {
          const { ResetPassword } = await import(
            './pages/ResetPassword/ResetPassword'
          );
          return { Component: ResetPassword };
        },
      },
      {
        path: AppRoutes.NewAnnouncement,
        lazy: async () => {
          const { NewAnnouncement } = await import(
            './pages/NewAnnouncement/NewAnnouncement'
          );
          return { Component: NewAnnouncement };
        },
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home} /> },
]);
