import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import { queryClient } from 'src/config/query-config';
import { User } from 'src/models/user';
import { getCurrentUserQueryKey } from 'src/queries/user-queries';
import App from './App';
import { AppRoutes } from './utils/enums/app-routes';

const protectedLoader = () => {
  const currentUser: User | null | undefined = queryClient.getQueryData(
    getCurrentUserQueryKey
  );
  return currentUser ? null : redirect(AppRoutes.Login);
};

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
        loader: () => null,
      },
      {
        path: AppRoutes.Login,
        lazy: async () => {
          const { Login } = await import('./pages/Login/Login');
          return { Component: Login };
        },
        loader: () => null,
      },
      {
        path: AppRoutes.Register,
        lazy: async () => {
          const { Register } = await import('./pages/Register/Register');
          return { Component: Register };
        },
        loader: () => null,
      },
      {
        path: AppRoutes.ForgotPassword,
        lazy: async () => {
          const { ForgotPassword } = await import(
            './pages/ForgotPassword/ForgotPassword'
          );
          return { Component: ForgotPassword };
        },
        loader: () => null,
      },
      {
        path: AppRoutes.ResetPassword,
        lazy: async () => {
          const { ResetPassword } = await import(
            './pages/ResetPassword/ResetPassword'
          );
          return { Component: ResetPassword };
        },
        loader: () => null,
      },
      {
        path: AppRoutes.NewAnnouncement,
        lazy: async () => {
          const { NewAnnouncement } = await import(
            './pages/NewAnnouncement/NewAnnouncement'
          );
          return { Component: NewAnnouncement };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.MyAnnouncements,
        lazy: async () => {
          const { MyAnnouncements } = await import(
            './pages/MyAnnouncements/MyAnnouncements'
          );
          return { Component: MyAnnouncements };
        },
        loader: protectedLoader,
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home} /> },
]);
