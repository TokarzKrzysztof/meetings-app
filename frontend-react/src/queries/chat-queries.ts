import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseQueryMethods
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Chat`;

export const useGetPrivateChat = (
  participantId: string,
  messagesAmount: number,
  options?: UseQueryOptions<Chat | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetPrivateChat', participantId, messagesAmount],
    queryFn: () => {
      const params = { participantId, messagesAmount };
      return axios.get(`${baseUrl}/GetPrivateChat`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('privateChat', query);
};

export const useGetMoreChatMessages = (
  chatId: string,
  skip: number,
  take: number,
  options?: UseQueryOptions<Message[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetMoreChatMessages', chatId, skip, take],
    queryFn: () => {
      const params = { chatId, skip, take };
      return axios.get(`${baseUrl}/GetMoreChatMessages`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('moreChatMessages', query);
};

export const useGetCurrentUserChats = (
  options?: UseQueryOptions<Chat[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserChats', query);
};