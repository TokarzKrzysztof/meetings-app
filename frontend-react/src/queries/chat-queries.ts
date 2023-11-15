import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
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

export const useLoadMoreChatMessages = (
  options?: UseMutationOptions<
    Message[],
    AxiosError<HttpErrorData>,
    { chatId: Chat['id']; skip: number; take: number }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.get(`${baseUrl}/LoadMoreChatMessages`, { params: data }),
    ...options,
  });

  return genericUseMutationMethods('loadMoreChatMessages', mutation);
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
  options?: UseQueryOptions<Chat[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserChats',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserChats`),
    ...options,
  });

  return genericUseQueryMethods('currentUserChats', query);
};
