export const AppRoutes = {
  Home: (params?: HomeParams) => makeUrl('/', params),
  Login: (params?: LoginParams) => makeUrl('/login', params),
  Register: () => '/register',
  ForgotPassword: () => '/forgot-password',
  ResetPassword: (params?: ResetPasswordParams) => makeUrl('/reset-password', params),
  AnnouncementResultList: (params?: AnnouncementResultListParams) =>
    makeUrl('/announcement-result-list', params),
  NewAnnouncement: () => '/new-announcement',
  EditAnnouncement: (params?: EditAnnouncementParams) => makeUrl('/edit-announcement', params),
  MyAnnouncements: () => '/my-announcements',
  MyProfile: () => '/my-profile',
  MyProfileChangeData: () => '/my-profile/change-data',
  MyProfileChangePassword: () => '/my-profile/change-password',
  MyProfileChangeEmail: () => '/my-profile/change-email',
  PrivateChat: (params?: PrivateChatParams) => makeUrl('/private-chat', params),
  GroupChat: (params?: GroupChatParams) => makeUrl('/group-chat', params),
  MyChats: () => '/my-chats',
  MyChatsPrivate: () => '/my-chats/private',
  MyChatsGroup: () => '/my-chats/group',
  NewGroupChat: () => '/new-group-chat',
} as const;

export type HomeParams = {
  isFromChangeEmailAddress?: 'true';
};

export type EditAnnouncementParams = {
  id: string;
};

export type ResetPasswordParams = {
  tempId: string;
};

export type AnnouncementResultListParams = {
  categoryId: string;
};

export type PrivateChatParams = {
  userId: string;
};

export type GroupChatParams = {
  returnUrl?: string;
  chatId: string;
};

export type LoginParams = {
  isFromResetPassword?: 'true';
  isFromActivation?: 'true';
};

const makeUrl = (url: string, params?: Record<string, string>) => {
  if (!params) return url;

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      delete params[key];
    }
  });

  const query = new URLSearchParams(params).toString();
  return `${url}?${query}`;
};
