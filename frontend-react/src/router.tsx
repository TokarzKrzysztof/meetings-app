import { Navigate, RouteObject, createBrowserRouter, redirect } from 'react-router-dom';
import { queryClient } from 'src/config/query-config';
import { User } from 'src/models/user';
import { getCurrentUserQueryFn, getCurrentUserQueryKey } from 'src/queries/user-queries';
import App from './App';
import { AppRoutes } from './utils/enums/app-routes';

const protectedLoader = async () => {
  // undefined when user is not yet fetched, null when user is not logged in
  let currentUser: User | null | undefined = queryClient.getQueryData(getCurrentUserQueryKey);
  if (currentUser === undefined) {
    currentUser = await queryClient.fetchQuery(getCurrentUserQueryKey, getCurrentUserQueryFn);
  }

  return currentUser ? null : redirect(AppRoutes.Login());
};

const publicRoutes: RouteObject[] = [
  {
    index: true,
    lazy: async () => {
      const { Home } = await import('./pages/Home/Home');
      return { Component: Home };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.Login(),
    lazy: async () => {
      const { Login } = await import('./pages/account/Login/Login');
      return { Component: Login };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.Register(),
    lazy: async () => {
      const { Register } = await import('./pages/account/Register/Register');
      return { Component: Register };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.ForgotPassword(),
    lazy: async () => {
      const { ForgotPassword } = await import('./pages/account/ForgotPassword/ForgotPassword');
      return { Component: ForgotPassword };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.ResetPassword({} as any),
    lazy: async () => {
      const { ResetPassword } = await import('./pages/account/ResetPassword/ResetPassword');
      return { Component: ResetPassword };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.AnnouncementResultList({} as any),
    lazy: async () => {
      const { AnnouncementResultList } = await import(
        './pages/announcement/AnnouncementResultList/AnnouncementResultList'
      );
      return { Component: AnnouncementResultList };
    },
    loader: () => null,
  },
  {
    path: AppRoutes.UserProfile({} as any),
    lazy: async () => {
      const { UserProfile } = await import('./pages/user/UserProfile/UserProfile');
      return { Component: UserProfile };
    },
    loader: () => null,
  },
];

export const router = createBrowserRouter([
  {
    path: AppRoutes.Home(),
    element: <App />,
    children: [
      ...publicRoutes,
      {
        path: AppRoutes.PrivateChat({} as any),
        lazy: async () => {
          const { PrivateChat } = await import('./pages/chat/PrivateChat/PrivateChat');
          return { Component: PrivateChat };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.GroupChat({} as any),
        lazy: async () => {
          const { GroupChat } = await import('./pages/chat/GroupChat/GroupChat');
          return { Component: GroupChat };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.MyChats(),
        lazy: async () => {
          const { MyChats } = await import('./pages/chat/MyChats/MyChats');
          return { Component: MyChats };
        },
        loader: protectedLoader,
        children: [
          {
            path: AppRoutes.MyChatsPrivate(),
            lazy: async () => {
              const { MyChatsPrivate } = await import(
                './pages/chat/MyChats/sub-pages/MyChatsPrivate'
              );
              return { Component: MyChatsPrivate };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyChatsGroup(),
            lazy: async () => {
              const { MyChatsGroup } = await import('./pages/chat/MyChats/sub-pages/MyChatsGroup');
              return { Component: MyChatsGroup };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyChatsIgnored(),
            lazy: async () => {
              const { MyChatsIgnored } = await import(
                './pages/chat/MyChats/sub-pages/MyChatsIgnored'
              );
              return { Component: MyChatsIgnored };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyChatsArchived(),
            lazy: async () => {
              const { MyChatsArchived } = await import(
                './pages/chat/MyChats/sub-pages/MyChatsArchived'
              );
              return { Component: MyChatsArchived };
            },
            loader: protectedLoader,
          },
        ],
      },
      {
        path: AppRoutes.NewGroupChat(),
        lazy: async () => {
          const { NewGroupChat } = await import('./pages/chat/NewGroupChat/NewGroupChat');
          return { Component: NewGroupChat };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.NewAnnouncement(),
        lazy: async () => {
          const { NewAnnouncement } = await import(
            './pages/announcement/NewAnnouncement/NewAnnouncement'
          );
          return { Component: NewAnnouncement };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.EditAnnouncement({} as any),
        lazy: async () => {
          const { EditAnnouncement } = await import(
            './pages/announcement/EditAnnouncement/EditAnnouncement'
          );
          return { Component: EditAnnouncement };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.MyAnnouncements(),
        lazy: async () => {
          const { MyAnnouncements } = await import(
            './pages/announcement/MyAnnouncements/MyAnnouncements'
          );
          return { Component: MyAnnouncements };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.MyAnnouncementsList({} as any),
        lazy: async () => {
          const { MyAnnouncementsList } = await import(
            './pages/announcement/MyAnnouncementsList/MyAnnouncementsList'
          );
          return { Component: MyAnnouncementsList };
        },
        loader: protectedLoader,
      },
      {
        path: AppRoutes.MyProfile(),
        lazy: async () => {
          const { MyProfile } = await import('./pages/account/MyProfile/MyProfile');
          return { Component: MyProfile };
        },
        loader: protectedLoader,
        children: [
          {
            path: AppRoutes.MyProfileChangeData(),
            lazy: async () => {
              const { MyProfileChangeData } = await import(
                './pages/account/MyProfile/sub-pages/MyProfileChangeData'
              );
              return { Component: MyProfileChangeData };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyProfileChangeEmail(),
            lazy: async () => {
              const { MyProfileChangeEmail } = await import(
                './pages/account/MyProfile/sub-pages/MyProfileChangeEmail'
              );
              return { Component: MyProfileChangeEmail };
            },
            loader: protectedLoader,
          },
          {
            path: AppRoutes.MyProfileChangePassword(),
            lazy: async () => {
              const { MyProfileChangePassword } = await import(
                './pages/account/MyProfile/sub-pages/MyProfileChangePassword'
              );
              return { Component: MyProfileChangePassword };
            },
            loader: protectedLoader,
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to={AppRoutes.Home()} /> },
]);
