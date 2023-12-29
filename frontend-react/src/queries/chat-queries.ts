import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Chat`;

export const useToggleIgnoreChat = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Chat['id']>
) => {
  const mutation = useMutation({
    mutationFn: (chatId) => {
      const params = { chatId };
      return axios.patch(`${baseUrl}/ToggleIgnoreChat`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('toggleIgnoreChat', mutation);
};

export const useToggleArchiveChat = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Chat['id']>
) => {
  const mutation = useMutation({
    mutationFn: (chatId) => {
      const params = { chatId };
      return axios.patch(`${baseUrl}/ToggleArchiveChat`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('toggleArchiveChat', mutation);
};

export const useLeaveGroupChat = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Chat['id']>
) => {
  const mutation = useMutation({
    mutationFn: (chatId) => {
      const params = { chatId };
      return axios.delete(`${baseUrl}/LeaveGroupChat`, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('leaveGroupChat', mutation);
};

export const useChangeGroupChatName = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; name: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.patch(`${baseUrl}/ChangeGroupChatName`, data),
    ...options,
  });

  return genericUseMutationMethods('changeGroupChatName', mutation);
};

export const useAddGroupChatParticipant = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; userId: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: ({ chatId, userId }) => {
      const params = { chatId, userId };
      return axios.post(`${baseUrl}/AddGroupChatParticipant`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('addGroupChatParticipant', mutation);
};

export const useRemoveGroupChatParticipant = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; userId: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: ({ chatId, userId }) => {
      const params = { chatId, userId };
      return axios.delete(`${baseUrl}/RemoveGroupChatParticipant`, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('removeGroupChatParticipant', mutation);
};

export const useCreateGroupChat = (
  options?: UseMutationOptions<
    Chat['id'],
    AxiosError<HttpErrorData>,
    { name: string; userIds: string[]; connectionId: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/CreateGroupChat`, data),
    ...options,
  });

  return genericUseMutationMethods('createGroupChat', mutation);
};

export const useCreatePrivateChat = (
  options?: UseMutationOptions<
    Chat,
    AxiosError<HttpErrorData>,
    { participantId: string; connectionId: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/CreatePrivateChat`, data),
    ...options,
  });

  return genericUseMutationMethods('createPrivateChat', mutation);
};

export const useGetGroupChat = (
  chatId: string,
  options?: UseQueryOptions<Chat, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetGroupChat', chatId],
    queryFn: () => {
      const params = { chatId };
      return axios.get(`${baseUrl}/GetGroupChat`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('groupChat', query);
};

export const getPrivateChatQueryKey = 'GetPrivateChat';
export const useGetPrivateChat = (
  participantId: string,
  options?: UseQueryOptions<Chat | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: getPrivateChatQueryKey,
    queryFn: () => {
      const params = { participantId };
      return axios.get(`${baseUrl}/GetPrivateChat`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('privateChat', query);
};

export const useGetCurrentUserPrivateChats = (
  options?: UseQueryOptions<ChatPreview[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserPrivateChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserPrivateChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserPrivateChats', query);
};

export const useGetCurrentUserGroupChats = (
  options?: UseQueryOptions<ChatPreview[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserGroupChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserGroupChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserGroupChats', query);
};

export const useGetCurrentUserIgnoredChats = (
  options?: UseQueryOptions<ChatPreview[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserIgnoredChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserIgnoredChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserIgnoredChats', query);
};

export const useGetCurrentUserArchivedChats = (
  options?: UseQueryOptions<ChatPreview[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserArchivedChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserArchivedChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserArchivedChats', query);
};

export const useGetUnreadChatsCount = (
  options?: UseQueryOptions<{ private: number; group: number }, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetUnreadChatsCount',
    queryFn: () => axios.get(`${baseUrl}/GetUnreadChatsCount`),
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('unreadChatsCount', query);
};

export const useMarkChatAsRead = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Chat['id']>
) => {
  const mutation = useMutation({
    mutationFn: (chatId) => {
      const params = { chatId };
      return axios.patch(`${baseUrl}/MarkChatAsRead`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('markChatAsRead', mutation);
};
