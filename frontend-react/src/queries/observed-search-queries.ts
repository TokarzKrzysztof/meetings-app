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
import { ObservedSearch } from 'src/models/observed-search';
import { PaginatedData } from 'src/models/paginated-data';
import { ResultListFilters } from 'src/utils/announcement-result-list-utils';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseInfiniteQueryMethods,
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/ObservedSearch`;

export const useAddObservedSearch = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    ResultListFilters & Pick<ObservedSearch, 'isEmailNotificationEnabled' | 'resultListUrl'>
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/AddObservedSearch`, data),
    ...options,
  });

  return genericUseMutationMethods('addObservedSearch', mutation);
};

export const useRemoveObservedSearch = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, ObservedSearch['id']>
) => {
  const mutation = useMutation({
    mutationFn: (id) => {
      const params = { id };
      return axios.delete(`${baseUrl}/RemoveObservedSearch`, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('removeObservedSearch', mutation);
};

export const useGetCurrentUserObservedSearches = (
  options?: UseInfiniteQueryOptions<PaginatedData<ObservedSearch>, AxiosError<HttpErrorData>>
) => {
  const query = usePaginatedQuery({
    pageSize: 10,
    url: `${baseUrl}/GetCurrentUserObservedSearches`,
    queryKey: 'GetCurrentUserObservedSearches',
    options,
  });
  return genericUseInfiniteQueryMethods('currentUserObservedSearches', query);
};

export const useTryGetObservedSearchByFilters = (
  filters: ResultListFilters,
  options?: UseQueryOptions<ObservedSearch | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['TryGetObservedSearchByFilters', filters],
    queryFn: () => axios.post(`${baseUrl}/TryGetObservedSearchByFilters`, filters),
    ...options,
  });

  return genericUseQueryMethods('observedSearchByFilters', query);
};

export const useToggleEmailNotification = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, ObservedSearch['id']>
) => {
  const mutation = useMutation({
    mutationFn: (id) => {
      const params = { id };
      return axios.patch(`${baseUrl}/ToggleEmailNotification`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('toggleEmailNotification', mutation);
};
