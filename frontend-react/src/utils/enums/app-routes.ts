import { AnnouncementStatus } from 'src/models/annoucement/announcement';
import { ResultListQueryParams } from 'src/utils/announcement-result-list-utils';
import { parseIntoURLParams } from 'src/utils/url-utils';

export const AppRoutes = {
  Home: (params?: HomeParams) => makeUrl('/', params),
  Login: (params?: LoginParams) => makeUrl('/login', params),
  Register: (params?: RegisterParams) => makeUrl('/register', params),
  ForgotPassword: () => '/forgot-password',
  ResetPassword: (params: ResetPasswordParams) => makeUrl('/reset-password', params),
  AnnouncementResultList: (params: ResultListQueryParams) =>
    makeUrl('/announcement-result-list', parseIntoURLParams(params)),
  NewAnnouncement: () => '/new-announcement',
  EditAnnouncement: (params: EditAnnouncementParams) => makeUrl('/edit-announcement', params),
  MyAnnouncements: () => '/my-announcements',
  MyAnnouncementsList: (params: MyAnnouncementsListParams) =>
    makeUrl('/my-announcements-list', params),
  Settings: () => '/settings',
  SettingsChangeData: () => '/settings/change-data',
  SettingsChangePassword: () => '/settings/change-password',
  SettingsChangeEmail: () => '/settings/change-email',
  PrivateChat: (params: PrivateChatParams) => makeUrl('/private-chat', params),
  GroupChat: (params: GroupChatParams) => makeUrl('/group-chat', params),
  MyChats: () => '/my-chats',
  MyChatsPrivate: () => '/my-chats/private',
  MyChatsGroup: () => '/my-chats/group',
  MyChatsIgnored: () => '/my-chats/ignored',
  MyChatsArchived: () => '/my-chats/archived',
  NewGroupChat: () => '/new-group-chat',
  UserProfile: (params: UserProfileParams) => makeUrl('/user-profile', params),
  ObservedSearches: () => '/observed-searches',
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

export type PrivateChatParams = {
  userId: string;
  announcementId?: string;
};

export type GroupChatParams = {
  chatId: string;
  returnUrl?: string;
};

export type LoginParams = {
  isFromResetPassword?: 'true';
  isFromActivation?: 'true';
  redirectUrl?: string;
};

export type RegisterParams = {
  redirectUrl?: string;
};

export type MyAnnouncementsListParams = {
  status: keyof typeof AnnouncementStatus;
};

export type UserProfileParams = {
  userId: string;
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
