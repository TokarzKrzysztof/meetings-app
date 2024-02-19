import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { apiUrl } from 'src/utils/api-url';
import {
    genericUseMutationMethods,
    genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/ChatParticipant`;

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
