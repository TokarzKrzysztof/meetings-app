import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Conversation } from 'src/models/conversation/conversation';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseQueryMethods
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Conversation`;

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