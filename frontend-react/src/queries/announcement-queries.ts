import { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import axios from 'src/config/axios-config';
import { Announcement, AnnouncementStatus } from 'src/models/announcement';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Announcement`;

export const useCreateNewAnnouncement = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement>
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/CreateNewAnnouncement`, data),
    ...options,
  });

  return genericUseMutationMethods('createNewAnnouncement', mutation);
};

export const useEditAnnouncement = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement>
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.put(`${baseUrl}/EditAnnouncement`, data),
    ...options,
  });

  return genericUseMutationMethods('editAnnouncement', mutation);
};

export const useGetCurrentUserAnnouncements = (
  options?: UseQueryOptions<Announcement[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserAnnouncements',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserAnnouncements`),
    ...options,
  });

  return genericUseQueryMethods('currentUserAnnoucements', query);
};

export const useSetAnnouncementStatus = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { id: string; newStatus: AnnouncementStatus }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.patch(`${baseUrl}/SetAnnouncementStatus`, data),
    ...options,
  });

  return genericUseMutationMethods('setAnnouncementStatus', mutation);
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
      return axios.delete(`${baseUrl}/RemoveAnnouncement`, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('removeAnnouncement', mutation);
};

export const useGetAnnouncement = (
  id: Announcement['id'],
  options?: UseQueryOptions<Announcement, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetAnnouncement', id],
    queryFn: () => {
      const params = { id };
      return axios.get(`${baseUrl}/GetAnnouncement`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('announcement', query);
};
