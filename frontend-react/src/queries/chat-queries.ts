import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseQueryMethods
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Chat`;

export const useGetChat = (
  participantId: string,
  options?: UseQueryOptions<Chat | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetChat', participantId],
    queryFn: () => {
      const params = { participantId };
      return axios.get(`${baseUrl}/GetChat`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('chat', query);
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