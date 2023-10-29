import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Conversation } from 'src/models/conversation/conversation';
import { Message } from 'src/models/conversation/message';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Conversation`;

export const useGetLatestConversationMessages = (
  data: { conversationId: string; lastMessageDate: string | null },
  options?: UseQueryOptions<Message[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetLatestConversationMessages', data],
    queryFn: () => {
      return axios.get(`${baseUrl}/GetLatestConversationMessages`, { params: data });
    },
    ...options,
  });

  return genericUseQueryMethods('latestConversationMessages', query);
};

export const useGetConversation = (
  participantId: string,
  options?: UseQueryOptions<Conversation, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetConversation', participantId],
    queryFn: () => {
      const params = { participantId, createIfNotExist: true };
      return axios.get(`${baseUrl}/GetConversation`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('conversation', query);
};

export const useGetCurrentUserConversations = (
  options?: UseQueryOptions<Conversation[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserConversations',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserConversations`),
    ...options,
  });

  return genericUseQueryMethods('currentUserConversations', query);
};

export const useSendMessage = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    Pick<Message, 'text' | 'conversationId'>
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/SendMessage`, data),
    ...options,
  });

  return genericUseMutationMethods('sendMessage', mutation);
};
