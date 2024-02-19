import { AxiosError } from 'axios';
import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import axios from 'src/config/axios-config';
import { usePaginatedQuery } from 'src/hooks/usePaginatedQuery';
import { Chat, UserChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { PaginatedData } from 'src/models/paginated-data';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseInfiniteQueryMethods,
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Chat`;

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

export const useGetCurrentUserChats = (
  type: UserChatType,
  options?: UseInfiniteQueryOptions<PaginatedData<ChatPreview>, AxiosError<HttpErrorData>>
) => {
  const query = usePaginatedQuery({
    pageSize: 10,
    url: `${baseUrl}/GetCurrentUserChats`,
    queryKey: ['GetCurrentUserChats', type],
    body: {
      type,
    },
    options,
  });

  return genericUseInfiniteQueryMethods('currentUserChats', query);
};