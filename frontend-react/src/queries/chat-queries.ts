import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat, ChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { Message } from 'src/models/chat/message';
import { SendMessageData } from 'src/models/chat/send-message-data';
import { apiUrl } from 'src/utils/api-url';
import { getFormData } from 'src/utils/http-utils';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Chat`;

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

export const useLoadChatMessages = (
  options?: UseMutationOptions<
    Message[],
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; skip: number; take: number }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.get(`${baseUrl}/LoadChatMessages`, { params: data }),
    ...options,
  });

  return genericUseMutationMethods('loadChatMessages', mutation);
};

export const useLoadAllMessagesAfterDate = (
  options?: UseMutationOptions<
    Message[],
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; afterDate: Message['createdAt'] }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.get(`${baseUrl}/LoadAllMessagesAfterDate`, { params: data }),
    ...options,
  });

  return genericUseMutationMethods('loadAllMessagesAfterDate', mutation);
};

export const useGetCurrentUserChats = (
  type: ChatType,
  options?: UseQueryOptions<ChatPreview[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetCurrentUserChats', type],
    queryFn: () => {
      const params = { type };
      return axios.get(`${baseUrl}/GetCurrentUserChats`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('currentUserChats', query);
};

export const useGetUnreadChatsCount = (
  options?: UseQueryOptions<number, AxiosError<HttpErrorData>>
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

export const useSendMessage = (
  onUploadProgress: (data: SendMessageData, percentage: number) => void,
  options?: UseMutationOptions<Message, AxiosError<HttpErrorData>, SendMessageData>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      const formData = getFormData(data);
      return axios.post(`${baseUrl}/SendMessage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          const percentage = +((event.loaded / event.total!) * 100).toFixed(0);
          onUploadProgress(data, percentage);
        },
      });
    },
    ...options,
  });

  return genericUseMutationMethods('sendMessage', mutation);
};
