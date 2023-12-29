import { AxiosError } from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';
import axios from 'src/config/axios-config';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { SendMessageData } from 'src/models/chat/send-message-data';
import { apiUrl } from 'src/utils/api-url';
import { getFormData } from 'src/utils/http-utils';
import { genericUseMutationMethods } from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Message`;

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

export const useSendMessage = (
  onUploadProgress: (data: SendMessageData, percentage: number) => void,
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, SendMessageData>
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
