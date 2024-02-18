import { AnnouncementStatus } from 'src/models/annoucement/announcement';
import { AnnouncementResultListQueryParams } from 'src/utils/announcement-filters-utils';
import { parseIntoURLParams } from 'src/utils/url-utils';

export const AppRoutes = {
  Home: (params?: HomeParams) => makeUrl('/', params),
  Login: (params?: LoginParams) => makeUrl('/login', params),
  Register: (params?: RegisterParams) => makeUrl('/register', params),
  ForgotPassword: () => '/forgot-password',
  ResetPassword: (params: ResetPasswordParams) => makeUrl('/reset-password', params),
  AnnouncementResultList: (params: AnnouncementResultListQueryParams) =>
    makeUrl('/announcement-result-list', parseIntoURLParams(params)),
  NewAnnouncement: () => '/new-announcement',
  EditAnnouncement: (params: EditAnnouncementParams) => makeUrl('/edit-announcement', params),
  MyAnnouncements: () => '/my-announcements',
  MyAnnouncementsList: (params: MyAnnouncementsListParams) =>
    makeUrl('/my-announcements-list', params),
  MyProfile: () => '/my-profile',
  MyProfileChangeData: () => '/my-profile/change-data',
  MyProfileChangePassword: () => '/my-profile/change-password',
  MyProfileChangeEmail: () => '/my-profile/change-email',
  PrivateChat: (params: PrivateChatParams) => makeUrl('/private-chat', params),
  GroupChat: (params: GroupChatParams) => makeUrl('/group-chat', params),
  MyChats: () => '/my-chats',
  MyChatsPrivate: () => '/my-chats/private',
  MyChatsGroup: () => '/my-chats/group',
  MyChatsIgnored: () => '/my-chats/ignored',
  MyChatsArchived: () => '/my-chats/archived',
  NewGroupChat: () => '/new-group-chat',
  UserProfile: (params: UserProfileParams) => makeUrl('/user-profile', params),
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
  status: keyof typeof AnnouncementStatus
};

export type UserProfileParams = {
  id: string;
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
