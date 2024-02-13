import { AxiosError } from 'axios';
import {
  UseInfiniteQueryOptions,
  UseMutationOptions,
  UseQueryOptions,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from 'react-query';
import axios from 'src/config/axios-config';
import { Announcement, AnnouncementStatus } from 'src/models/annoucement/announcement';
import { AnnouncementResultListItem } from 'src/models/annoucement/announcement-result-list';
import { PaginatedData } from 'src/models/paginated-data';
import { AnnouncementResultListQueryParams } from 'src/utils/announcement-filters-utils';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Announcement`;

export const useGetAnnouncementResultList = (
  params: AnnouncementResultListQueryParams,
  options?: UseInfiniteQueryOptions<
    PaginatedData<AnnouncementResultListItem>,
    AxiosError<HttpErrorData>
  >
) => {
  const pageSize = 10;

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['GetAnnouncementResultList', params],
    queryFn: ({ pageParam }) =>
      axios.post(`${baseUrl}/GetAnnouncementResultList`, {
        ...params,
        skip: pageParam,
        take: pageSize,
      }),
    getNextPageParam: (lastPage, pages) => {
      const length = pages.flatMap((x) => x.data).length;
      return length < lastPage.totalCount ? length : null;
    },
    staleTime: Infinity,
    ...options,
  });

  return {
    announcements: data?.pages.flatMap((x) => x.data),
    fetchNextPage,
    hasNextPage,
    isFetching,
  };
};

export const useGetCurrentUserAnnouncements = (
  status: AnnouncementStatus,
  options?: UseInfiniteQueryOptions<PaginatedData<Announcement>, AxiosError<HttpErrorData>>
) => {
  const pageSize = 20;

  const { data, fetchNextPage, hasNextPage, isFetching, refetch } = useInfiniteQuery({
    queryKey: ['GetCurrentUserAnnouncements', status],
    queryFn: ({ pageParam }) => {
      const params = { skip: pageParam, take: pageSize, status };
      return axios.get(`${baseUrl}/GetCurrentUserAnnouncements`, { params });
    },
    getNextPageParam: (lastPage, pages) => {
      const length = pages.flatMap((x) => x.data).length;
      return length < lastPage.totalCount ? length : null;
    },
    ...options,
  });

  return {
    announcements: data?.pages.flatMap((x) => x.data),
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
  };
};

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
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Announcement['id']>
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

export const useGetCurrentUserOccupiedCategoryIds = (
  options?: UseQueryOptions<string[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserOccupiedCategoryIds',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserOccupiedCategoryIds`),
    ...options,
  });

  return genericUseQueryMethods('currentUserOccupiedCategoryIds', query);
};

export const useGetCurrentUserAnnouncementsCount = (
  options?: UseQueryOptions<
    { active: number; pending: number; closed: number },
    AxiosError<HttpErrorData>
  >
) => {
  const query = useQuery({
    queryKey: 'GetCurrentUserAnnouncementsCount',
    queryFn: () => axios.get(`${baseUrl}/GetCurrentUserAnnouncementsCount`),
    ...options,
  });

  return genericUseQueryMethods('currentUserAnnouncementsCount', query);
};
