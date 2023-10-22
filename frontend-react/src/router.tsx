import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import { queryClient } from 'src/config/query-config';
import { User } from 'src/models/user';
import {
  getCurrentUserQueryFn,
  getCurrentUserQueryKey,
} from 'src/queries/user-queries';
import App from './App';
import { AppRoutes } from './utils/enums/app-routes';

const protectedLoader = async () => {
  // undefined when user is not yet fetched, null when user is not logged in
  let currentUser: User | null | undefined = queryClient.getQueryData(
    getCurrentUserQueryKey
  );
  if (currentUser === undefined) {
    currentUser = await queryClient.fetchQuery(
      getCurrentUserQueryKey,
      getCurrentUserQueryFn
    );
  }

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
        path: AppRoutes.EditAnnouncement,
        lazy: async () => {
          const { EditAnnouncement } = await import(
            './pages/EditAnnouncement/EditAnnouncement'
          );
          return { Component: EditAnnouncement };
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
      {
        path: AppRoutes.MyProfile,
        lazy: async () => {
          const { MyProfile } = await import('./pages/MyProfile/MyProfile');
          return { Component: MyProfile };
        },
        loader: protectedLoader,
        children: [
          {
            path: AppRoutes.MyProfileChangeData,
            lazy: async () => {
              const { MyProfileChangeData } = await import(
                './pages/MyProfile/pages/MyProfileChangeData/MyProfileChangeData'
              );
              return { Component: MyProfileChangeData };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyProfileChangeEmail,
            lazy: async () => {
              const { MyProfileChangeEmail } = await import(
                './pages/MyProfile/pages/MyProfileChangeEmail/MyProfileChangeEmail'
              );
              return { Component: MyProfileChangeEmail };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyProfileChangePassword,
            lazy: async () => {
              const { MyProfileChangePassword } = await import(
                './pages/MyProfile/pages/MyProfileChangePassword/MyProfileChangePassword'
              );
              return { Component: MyProfileChangePassword };
            },
            loader: protectedLoader,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home} /> },
]);
