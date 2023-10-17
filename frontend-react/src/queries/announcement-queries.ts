import axios, { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import { Announcement, AnnouncementStatus } from 'src/models/announcement';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Announcement`;

export const useCreateNewAnnouncement = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement>
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

export const useEditAnnouncement = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .put(`${baseUrl}/EditAnnouncement`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    editAnnouncement: mutation.mutate,
    editAnnouncementResult: mutation.data,
    editAnnouncementError: mutation.error?.response?.data,
    editAnnouncementInProgress: mutation.isLoading,
    editAnnouncementSuccess: mutation.isSuccess,
    editAnnouncementReset: mutation.reset,
  };
};

export const useGetCurrentUserAnnouncements = (
  options?: UseQueryOptions<Announcement[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserAnnouncements',
    queryFn: () =>
      axios
        .get(`${baseUrl}/GetCurrentUserAnnouncements`)
        .then((res) => res.data),
    ...options,
  });

  return {
    currentUserAnnoucements: query.data,
    currentUserAnnoucementsFetching: query.isFetching,
    currentUserAnnoucementsFetchingError: query.error,
    currentUserAnnoucementsRefetch: query.refetch,
  };
};

export const useSetAnnouncementStatus = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { id: string; newStatus: AnnouncementStatus }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .patch(`${baseUrl}/SetAnnouncementStatus`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    setAnnouncementStatus: mutation.mutate,
    setAnnouncementStatusResult: mutation.data,
    setAnnouncementStatusError: mutation.error?.response?.data,
    setAnnouncementStatusInProgress: mutation.isLoading,
    setAnnouncementStatusSuccess: mutation.isSuccess,
    setAnnouncementStatusReset: mutation.reset,
  };
};

export const useRemoveAnnouncement = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    Announcement['id']
  >
) => {
  const mutation = useMutation({
    mutationFn: (id) => {
      const params = { id };
      return axios
        .delete(`${baseUrl}/RemoveAnnouncement`, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    removeAnnouncement: mutation.mutate,
    removeAnnouncementResult: mutation.data,
    removeAnnouncementError: mutation.error?.response?.data,
    removeAnnouncementInProgress: mutation.isLoading,
    removeAnnouncementSuccess: mutation.isSuccess,
    removeAnnouncementReset: mutation.reset,
  };
};

export const useGetAnnouncement = (
  id: Announcement['id'],
  options?: UseQueryOptions<Announcement, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetAnnouncement', id],
    queryFn: () => {
      const params = { id };
      return axios
        .get(`${baseUrl}/GetAnnouncement`, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    announcement: query.data,
    announcementFetching: query.isFetching,
    announcementFetchingError: query.error,
  };
};
