import axios, { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/User`;

export const useIsEmailTaken = (
  options?: UseMutationOptions<boolean, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios
        .get(`${baseUrl}/IsEmailTaken`, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    isEmailTaken: mutation.mutate,
    isEmailTakenResult: mutation.data,
    isEmailTakenError: mutation.error?.response?.data,
    isEmailTakenInProgress: mutation.isLoading,
    isEmailTakenReset: mutation.reset,
  };
};

export const getCurrentUserQueryKey = 'GetCurrentUser';
export const getCurrentUserQueryFn = () =>
  axios.get(`${baseUrl}/GetCurrentUser`).then((res) => res.data);
export const useGetCurrentUser = (
  options?: UseQueryOptions<User | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: getCurrentUserQueryKey,
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
    ...options,
  });

  return {
    currentUser: query.data,
    currentUserFetching: query.isLoading,
    currentUserFetchingError: query.error,
  };
};
