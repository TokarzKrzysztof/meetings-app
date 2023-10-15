import axios, { AxiosError } from 'axios';
import {
    UseMutationOptions,
    useMutation
} from 'react-query';
import { Announcement } from 'src/models/announcement';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Announcement`;

export const useCreateNewAnnouncement = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/CreateNewAnnouncement`, data).then((res) => res.data);
    },
    ...options,
  });

  return {
    createNewAnnouncement: mutation.mutate,
    createNewAnnouncementResult: mutation.data,
    createNewAnnouncementError: mutation.error?.response?.data,
    createNewAnnouncementInProgress: mutation.isLoading,
    createNewAnnouncementSuccess: mutation.isSuccess,
    createNewAnnouncementReset: mutation.reset,
  };
};
