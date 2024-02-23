import { AxiosError } from 'axios';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Interest, UserProfile } from 'src/models/user-profile';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/UserProfile`;

export const useGetUserProfile = (
  userId: string,
  options?: UseQueryOptions<UserProfile, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetUserProfile', userId],
    queryFn: () => {
      const params = { userId };
      return axios.get(`${baseUrl}/GetUserProfile`, { params });
    },
    ...options,
  });

  return genericUseQueryMethods('userProfile', query);
};

export const useEditDescription = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, UserProfile['description']>
) => {
  const mutation = useMutation({
    mutationFn: (description) => {
      const params = { description };
      return axios.patch(`${baseUrl}/EditDescription`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('editDescription', mutation);
};

export const useEditInterests = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, string[]>
) => {
  const mutation = useMutation({
    mutationFn: (ids) => {
      const params = { ids };
      return axios.patch(`${baseUrl}/EditInterests`, null, {
        params,
        paramsSerializer: { indexes: null },
      });
    },
    ...options,
  });

  return genericUseMutationMethods('editInterests', mutation);
};

export const useGetAvailableInterests = (
  options?: UseQueryOptions<Interest[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetAvailableInterests',
    queryFn: () => axios.get(`${baseUrl}/GetAvailableInterests`),
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('availableInterests', query);
};
