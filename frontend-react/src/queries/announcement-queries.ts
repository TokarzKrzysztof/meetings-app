import axios, { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import { Announcement } from 'src/models/announcement';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Announcement`;

export const useCreateNewAnnouncement = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    Omit<Announcement, 'id' | 'userId'>
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .post(`${baseUrl}/CreateNewAnnouncement`, data)
        .then((res) => res.data);
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

export const useGetCurrentUserAnnouncements = (
    options?: UseQueryOptions<Announcement[], AxiosError<HttpErrorData>>
  ) => {
    const query = useQuery({
      queryKey: 'GetCurrentUserAnnouncements',
      queryFn: () =>
        axios.get(`${baseUrl}/GetCurrentUserAnnouncements`).then((res) => res.data),
      ...options,
    });
  
    return {
      currentUserAnnoucements: query.data,
      currentUserAnnoucementsFetching: query.isFetching,
      currentUserAnnoucementsFetchingError: query.error,
    };
  };
  
